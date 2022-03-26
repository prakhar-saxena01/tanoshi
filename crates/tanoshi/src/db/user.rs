use super::model::{Token, User};
use anyhow::{anyhow, Result};
use sqlx::{
    sqlite::{SqliteArguments, SqlitePool},
    Arguments, Row,
};
use tokio_stream::StreamExt;

#[derive(Debug, Clone)]
pub struct Db {
    pool: SqlitePool,
}

impl Db {
    pub fn new(pool: SqlitePool) -> Db {
        Db { pool }
    }

    pub async fn insert_user(&self, user: User) -> Result<i64> {
        let mut conn = self.pool.acquire().await?;
        let row_id = sqlx::query(
            r#"INSERT INTO user(
                username,
                password,
                is_admin
            ) VALUES (?, ?, ?)"#,
        )
        .bind(&user.username)
        .bind(&user.password)
        .bind(user.is_admin)
        .execute(&mut conn)
        .await?
        .last_insert_rowid();

        Ok(row_id)
    }

    pub async fn update_password(&self, id: i64, password: String) -> Result<u64> {
        let mut conn = self.pool.acquire().await?;
        let row_id = sqlx::query(
            r#"UPDATE user
                SET password = ?
                WHERE id = ?"#,
        )
        .bind(&password)
        .bind(id)
        .execute(&mut conn)
        .await?
        .rows_affected();

        Ok(row_id)
    }

    #[allow(dead_code)]
    pub async fn update_user_is_admin(&self, id: i64, is_admin: bool) -> Result<u64> {
        let mut conn = self.pool.acquire().await?;
        let row_id = sqlx::query(
            r#"UPDATE user
                SET is_admin = ?
                WHERE id = ?"#,
        )
        .bind(&is_admin)
        .bind(id)
        .execute(&mut conn)
        .await?
        .rows_affected();

        Ok(row_id)
    }

    pub async fn get_users(&self) -> Result<Vec<User>> {
        let mut conn = self.pool.acquire().await?;
        let mut stream = sqlx::query(r#"SELECT * FROM user"#).fetch(&mut conn);

        let mut users = vec![];
        while let Some(row) = stream.try_next().await? {
            users.push(User {
                id: row.get(0),
                username: row.get(1),
                password: row.get(2),
                is_admin: row.get(3),
                created_at: row.get(4),
                updated_at: row.get(5),
                telegram_chat_id: row.get(6),
                pushover_user_key: row.get(7),
            })
        }

        Ok(users)
    }

    pub async fn get_users_count(&self) -> Result<i64> {
        let mut conn = self.pool.acquire().await?;
        let stream = sqlx::query(r#"SELECT COUNT(1) FROM user"#)
            .fetch_one(&mut conn)
            .await;

        Ok(stream.map(|row| row.get(0))?)
    }

    pub async fn get_admins(&self) -> Result<Vec<User>> {
        let mut conn = self.pool.acquire().await?;
        let mut stream =
            sqlx::query(r#"SELECT * FROM user WHERE is_admin = true"#).fetch(&mut conn);

        let mut users = vec![];
        while let Some(row) = stream.try_next().await? {
            users.push(User {
                id: row.get(0),
                username: row.get(1),
                password: row.get(2),
                is_admin: row.get(3),
                created_at: row.get(4),
                updated_at: row.get(5),
                telegram_chat_id: row.get(6),
                pushover_user_key: row.get(7),
            });
        }
        Ok(users)
    }

    pub async fn get_user_by_id(&self, id: i64) -> Result<User> {
        let mut conn = self.pool.acquire().await?;
        let stream = sqlx::query(r#"SELECT * FROM user WHERE id = ?"#)
            .bind(id)
            .fetch_one(&mut conn)
            .await;

        Ok(stream.map(|row| User {
            id: row.get(0),
            username: row.get(1),
            password: row.get(2),
            is_admin: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            telegram_chat_id: row.get(6),
            pushover_user_key: row.get(7),
        })?)
    }

    pub async fn get_user_by_username(&self, username: String) -> Result<User> {
        let mut conn = self.pool.acquire().await?;
        let stream = sqlx::query(r#"SELECT * FROM user WHERE username = ?"#)
            .bind(&username)
            .fetch_one(&mut conn)
            .await;

        Ok(stream.map(|row| User {
            id: row.get(0),
            username: row.get(1),
            password: row.get(2),
            is_admin: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            telegram_chat_id: row.get(6),
            pushover_user_key: row.get(7),
        })?)
    }

    pub async fn update_user_setting(&self, user: &User) -> Result<u64> {
        let mut conn = self.pool.acquire().await?;
        let mut column_to_update = vec![];
        let mut arguments = SqliteArguments::default();

        column_to_update.push("telegram_chat_id = ?");
        column_to_update.push("pushover_user_key = ?");
        arguments.add(user.telegram_chat_id);
        arguments.add(user.pushover_user_key.clone());
        arguments.add(user.id);

        if column_to_update.is_empty() {
            return Err(anyhow!("Nothing to update"));
        }

        let query = format!(
            r#"UPDATE user SET
                {}
                WHERE id = ?"#,
            column_to_update.join(",")
        );

        let rows_affected = sqlx::query_with(&query, arguments)
            .execute(&mut conn)
            .await?
            .rows_affected();

        Ok(rows_affected)
    }

    pub async fn insert_tracker_credential(
        &self,
        user_id: i64,
        tracker: &str,
        token: Token,
    ) -> Result<()> {
        let mut conn = self.pool.acquire().await?;
        sqlx::query(
            r#"INSERT INTO tracker_credential(
                user_id,
                tracker,
                token_type,
                expires_in,
                access_token,
                refresh_token
            ) VALUES (?, ?, ?, ?, ?, ?) 
            ON CONFLICT(user_id, tracker) DO UPDATE SET 
            token_type = excluded.token_type,
            expires_in = excluded.expires_in,
            access_token = excluded.access_token,
            refresh_token = excluded.refresh_token"#,
        )
        .bind(user_id)
        .bind(tracker)
        .bind(token.token_type)
        .bind(token.expires_in)
        .bind(token.access_token)
        .bind(token.refresh_token)
        .execute(&mut conn)
        .await?;

        Ok(())
    }
}
