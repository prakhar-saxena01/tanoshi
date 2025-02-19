use crate::{notifier::Notifier, user::Claims};
use async_graphql::{Context, Object, Result};

#[derive(Default)]
pub struct NotificationRoot;

#[Object]
impl NotificationRoot {
    async fn test_telegram(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "telegram chat id")] chat_id: i64,
    ) -> Result<bool> {
        let _ = ctx
            .data::<Claims>()
            .map_err(|_| "token not exists, please login")?;
        ctx.data::<Notifier>()?
            .send_message_to_telegram(chat_id, "Test Notification")
            .await?;

        Ok(true)
    }

    async fn test_pushover(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "pushover user key")] user_key: String,
    ) -> Result<bool> {
        let _ = ctx
            .data::<Claims>()
            .map_err(|_| "token not exists, please login")?;
        ctx.data::<Notifier>()?
            .send_message_to_pushover(&user_key, None, "Test Notification")
            .await?;

        Ok(true)
    }

    async fn test_desktop_notification(&self, _ctx: &Context<'_>) -> Result<bool> {
        #[cfg(feature = "desktop")]
        {
            _ctx.data::<Notifier>()?
                .send_desktop_notification(None, "Test Notification")?;

            Ok(true)
        }

        #[cfg(not(feature = "desktop"))]
        Err("desktop notification only available for desktop version".into())
    }
}
