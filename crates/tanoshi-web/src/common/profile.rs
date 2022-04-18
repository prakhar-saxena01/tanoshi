use std::rc::Rc;

use dominator::{clone, html, routing, Dom};
use dominator::{with_node, EventOptions};
use futures_signals::signal::Mutable;
use futures_signals::signal::SignalExt;
use wasm_bindgen::UnwrapThrowExt;
use web_sys::HtmlInputElement;

use crate::common::{events, snackbar, Route};
use crate::query;
use crate::utils::{is_tauri_signal, local_storage, AsyncLoader};

pub struct Profile {
    old_password: Mutable<String>,
    new_password: Mutable<String>,
    confirm_password: Mutable<String>,
    telegram_chat_id: Mutable<Option<String>>,
    pushover_user_key: Mutable<Option<String>>,
    myanimelist_status: Mutable<bool>,
    anilist_status: Mutable<bool>,
    pub loader: AsyncLoader,
}

impl Profile {
    pub fn new() -> Rc<Self> {
        Rc::new(Self {
            old_password: Mutable::new("".to_string()),
            new_password: Mutable::new("".to_string()),
            confirm_password: Mutable::new("".to_string()),
            telegram_chat_id: Mutable::new(None),
            pushover_user_key: Mutable::new(None),
            myanimelist_status: Mutable::new(false),
            anilist_status: Mutable::new(false),
            loader: AsyncLoader::new(),
        })
    }

    fn fetch_me(profile: Rc<Self>) {
        profile.loader.load(clone!(profile => async move {
            match query::fetch_me().await {
                Ok(result) => {
                    profile.telegram_chat_id.set(result.telegram_chat_id.map(|id| id.to_string()));
                    profile.pushover_user_key.set(result.pushover_user_key);
                    profile.myanimelist_status.set(result.myanimelist_status);
                    profile.anilist_status.set(result.anilist_status);
                },
                Err(err) => {
                    snackbar::show(format!("{}", err));
                }
            }
        }));
    }

    fn test_telegram(profile: Rc<Self>) {
        if let Some(chat_id) = profile
            .telegram_chat_id
            .get_cloned()
            .map(|id| id.parse().unwrap_or_default())
        {
            profile.loader.load(async move {
                match query::test_telegram(chat_id).await {
                    Ok(_) => {}
                    Err(err) => {
                        snackbar::show(format!("{}", err));
                    }
                }
            });
        }
    }

    fn test_pushover(profile: Rc<Self>) {
        if let Some(user_key) = profile.pushover_user_key.get_cloned() {
            profile.loader.load(async move {
                match query::test_pushover(&user_key).await {
                    Ok(_) => {}
                    Err(err) => {
                        snackbar::show(format!("{}", err));
                    }
                }
            });
        }
    }

    fn test_dekstop_notification(profile: Rc<Self>) {
        profile.loader.load(async move {
            match query::test_desktop_notification().await {
                Ok(_) => {}
                Err(err) => {
                    snackbar::show(format!("{}", err));
                }
            }
        });
    }

    fn tracker_logout(profile: Rc<Self>, tracker: String) {
        profile.loader.load(clone!(profile => async move {
            match query::tracker_logout(tracker).await {
                Ok(_) => Self::fetch_me(profile),
                Err(err) => {
                    snackbar::show(format!("{}", err));
                }
            }
        }))
    }

    fn change_password(profile: Rc<Self>) {
        profile.loader.load(clone!(profile => async move {
            let old_password = profile.old_password.get_cloned();
            let new_password = profile.new_password.get_cloned();
            match query::change_password(old_password, new_password).await {
                Ok(_) => {
                    // routing::go_to_url(Route::Settings(SettingCategory::None).url().as_str());
                },
                Err(e) => {
                    snackbar::show(format!("change password error: {}", e));
                }
            };
        }));
    }

    fn update_profile(profile: Rc<Self>) {
        profile.loader.load(clone!(profile => async move {
            let telegram_chat_id = profile.telegram_chat_id.get_cloned().and_then(|telegram_chat_id| telegram_chat_id.parse().ok());
            let pushover_user_key = profile.pushover_user_key.get_cloned();
            match query::update_profile(telegram_chat_id, pushover_user_key).await {
                Ok(_) => {
                    // routing::go_to_url(Route::Settings(SettingCategory::None).url().as_str());
                },
                Err(e) => {
                    snackbar::show(format!("change password error: {}", e));
                }
            };
        }));
    }

    pub fn render_change_password(profile: Rc<Self>) -> Dom {
        html!("form", {
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("max-width", "1024px")
            .style("margin-left", "auto")
            .style("margin-right", "auto")
            .style("margin-bottom", "0.5rem")
            .style("padding", "0.5rem")
            .style("border-radius", "0.5rem")
            .style("border", "var(--list-group-border)")
            .children(&mut [
                html!("span", {
                    .style("margin-left", "0.25rem")
                    .style("margin-bottom", "0.5rem")
                    .text("Change Password")
                }),
                html!("input" => HtmlInputElement, {
                    .attribute("type", "password")
                    .attribute("placeholder", "Current Password")
                    .property_signal("value", profile.old_password.signal_cloned())
                    .with_node!(input => {
                        .event(clone!(profile => move |_: events::Input| {
                            profile.old_password.set(input.value());
                        }))
                    })
                }),
                html!("span", {
                    .visible_signal(profile.confirm_password.signal_cloned().map(clone!(profile => move |x| x != profile.new_password.get_cloned())))
                    .style("margin-left", "0.5rem")
                    .style("margin-right", "0.5rem")
                    .style("color", "red")
                    .text("Password do not match")
                }),

                html!("span", {
                    .visible_signal(profile.new_password.signal_cloned().map(|x| x.len() < 8))
                    .style("margin-left", "0.5rem")
                    .style("margin-right", "0.5rem")
                    .style("color", "red")
                    .text("Minimum password length is 8")
                }),
                html!("input" => HtmlInputElement, {
                    .class_signal("error", profile.confirm_password.signal_cloned().map(clone!(profile => move |x| x != profile.new_password.get_cloned())))
                    .attribute("type", "password")
                    .attribute("placeholder", "New Password")
                    .property_signal("value", profile.new_password.signal_cloned())
                    .with_node!(input => {
                        .event(clone!(profile => move |_: events::Input| {
                            profile.new_password.set(input.value());
                        }))
                    })
                }),
                html!("input" => HtmlInputElement, {
                    .class_signal("error", profile.confirm_password.signal_cloned().map(clone!(profile => move |x| x != profile.new_password.get_cloned())))
                    .attribute("type", "password")
                    .attribute("placeholder", "Confirm Password")
                    .property_signal("value", profile.confirm_password.signal_cloned())
                    .with_node!(input => {
                        .event(clone!(profile => move |_: events::Input| {
                            profile.confirm_password.set(input.value());
                        }))
                    })
                }),
                html!("div", {
                    .style("display", "flex")
                    .style("justify-content", "flex-end")
                    .style("margin-top", "0.5rem")
                    .children(&mut [
                        html!("input", {
                            .attribute("type", "submit")
                            .attribute_signal("disabled", profile.confirm_password.signal_cloned().map(clone!(profile => move |x| {
                                if x != profile.new_password.get_cloned() || x.len() < 8 {
                                    Some("true")
                                } else {
                                    None
                                }
                            })))
                            .text("Submit")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::change_password(profile.clone());
                            }))
                        })
                    ])
                })
            ])
        })
    }

    pub fn render_notification_setting(profile: Rc<Self>) -> Dom {
        html!("form", {
            .class("content")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("max-width", "1024px")
            .style("margin-left", "auto")
            .style("margin-right", "auto")
            .style("margin-bottom", "0.5rem")
            .style("padding", "0.5rem")
            .style("border-radius", "0.5rem")
            .style("border", "var(--list-group-border)")
            .children(&mut [
                html!("span", {
                    .style("margin-left", "0.25rem")
                    .style("margin-bottom", "0.5rem")
                    .text("Notification")
                }),
                html!("div", {
                    .style("display", "flex")
                    .style("justify-content", "flex-end")
                    .style("margin-right", "0.5rem")
                    .style("margin-top", "0.5rem")
                    .visible_signal(is_tauri_signal())
                    .children(&mut [
                        html!("input", {
                            .attribute("type", "button")
                            .attribute("value", "Test Desktop Notification")
                            .text("Test Desktop Notification")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::test_dekstop_notification(profile.clone());
                            }))
                        }),
                    ])
                }),
                html!("div", {
                    .style("display", "flex")
                    .children(&mut [
                        html!("input" => HtmlInputElement, {
                            .style("width", "100%")
                            .attribute("type", "text")
                            .attribute("placeholder", "Telegram chat id, get from telegram bot")
                            .property_signal("value", profile.telegram_chat_id.signal_cloned().map(|id| id.unwrap_or_else(|| "".to_string())))
                            .with_node!(input => {
                                .event(clone!(profile => move |_: events::Input| {
                                    profile.telegram_chat_id.set(Some(input.value()));
                                }))
                            })
                        }),
                        html!("input", {
                            .attribute("type", "button")
                            .attribute("value", "Test")
                            .text("Test Telegram")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::test_telegram(profile.clone());
                            }))
                        }),
                    ])
                }),
                html!("div", {
                    .style("display", "flex")
                    .children(&mut [
                        html!("input" => HtmlInputElement, {
                            .style("width", "100%")
                            .attribute("type", "text")
                            .attribute("placeholder", "Pushover user key, get from pushover dashboard")
                            .property_signal("value", profile.pushover_user_key.signal_cloned().map(|id| id.unwrap_or_else(|| "".to_string())))
                            .with_node!(input => {
                                .event(clone!(profile => move |_: events::Input| {
                                    profile.pushover_user_key.set(Some(input.value()));
                                }))
                            })
                        }),
                        html!("input", {
                            .attribute("type", "button")
                            .attribute("value", "Test")
                            .text("Test Pushover")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::test_pushover(profile.clone());
                            }))
                        }),
                    ])
                }),
                html!("div", {
                    .style("display", "flex")
                    .style("justify-content", "flex-end")
                    .style("margin-top", "0.5rem")
                    .children(&mut [
                        html!("input", {
                            .attribute("type", "submit")
                            .text("Submit")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::update_profile(profile.clone());
                            }))
                        })
                    ])
                })
            ])
        })
    }

    fn render_tracker_setting(profile: Rc<Self>) -> Dom {
        html!("div", {
            .class("content")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("max-width", "1024px")
            .style("margin-left", "auto")
            .style("margin-right", "auto")
            .style("padding", "0.75rem")
            .style("margin-bottom", "0.5rem")
            .style("border-radius", "0.5rem")
            .style("border", "var(--list-group-border)")
            .children(&mut [
                html!("span", {
                    .style("margin-bottom", "0.5rem")
                    .text("Tracker")
                }),
                html!("div", {
                    .attribute("id", "myanimelist")
                    .style("display", "flex")
                    .style("margin-bottom", "0.5rem")
                    .children(&mut [
                        html!("div", {
                            .style("display", "flex")
                            .style("align-items", "center")
                            .style("width", "100%")
                            .children(&mut [
                                html!("img", {
                                    .style("height", "20px")
                                    .style("width", "20px")
                                    .style("margin-right", "0.5rem")
                                    .attribute("src", "https://myanimelist.net/img/common/pwa/launcher-icon-0-75x.png")
                                }),
                                html!("span", {
                                    .text("MyAnimeList")
                                })
                            ])
                        }),
                    ])
                    .child_signal(profile.myanimelist_status.signal_cloned().map(clone!(profile => move |status| if status {
                        Some(html!("button", {
                            .style("color", "red")
                            .text("Logout")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::tracker_logout(profile.clone(), "myanimelist".to_string());
                            }))
                        }))
                    } else {
                        Some(html!("a", {
                            .class("button")
                            .attribute("href", &Route::TrackerLogin("myanimelist".to_string()).url())
                            .attribute("target", "_blank")
                            .text("Login")
                        }))
                    })))
                }),
                html!("div", {
                    .attribute("id", "anilist")
                    .style("display", "flex")
                    .style("margin-bottom", "0.5rem")
                    .children(&mut [
                        html!("div", {
                            .style("display", "flex")
                            .style("align-items", "center")
                            .style("width", "100%")
                            .children(&mut [
                                html!("img", {
                                    .style("height", "20px")
                                    .style("width", "20px")
                                    .style("margin-right", "0.5rem")
                                    .attribute("src", "https://upload.wikimedia.org/wikipedia/commons/6/61/AniList_logo.svg")
                                }),
                                html!("span", {
                                    .text("AniList")
                                })
                            ])
                        }),
                    ])
                    .child_signal(profile.anilist_status.signal_cloned().map(clone!(profile => move |status| if status {
                        Some(html!("button", {
                            .style("color", "red")
                            .text("Logout")
                            .event_with_options(&EventOptions::preventable(), clone!(profile => move |e: events::Click| {
                                e.prevent_default();
                                Self::tracker_logout(profile.clone(), "anilist".to_string());
                            }))
                        }))
                    } else {
                        Some(html!("a", {
                            .class("button")
                            .attribute("href", &Route::TrackerLogin("anilist".to_string()).url())
                            .attribute("target", "_blank")
                            .text("Login")
                        }))
                    })))
                }),
            ])
        })
    }

    pub fn render(profile: Rc<Self>) -> Dom {
        Self::fetch_me(profile.clone());

        html!("div", {
            .children(&mut [
                Self::render_change_password(profile.clone()),
                Self::render_notification_setting(profile.clone()),
                Self::render_tracker_setting(profile),
                html!("div", {
                    .style("max-width", "1024px")
                    .style("margin-left", "auto")
                    .style("margin-right", "auto")
                    .children(&mut [
                        html!("button", {
                            .class("uninstall-btn")
                            .children(&mut [
                                html!("span", {
                                    .text("Logout")
                                    .event(|_: events::Click| {
                                        local_storage().delete("token").unwrap_throw();
                                        routing::go_to_url("/login");
                                    })
                                })
                            ])
                        })
                    ])
                })
            ])
        })
    }
}
