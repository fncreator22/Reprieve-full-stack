import pytest
from app.services import plugins


def test_get_integrations_defaults():
    res = plugins.get_integrations({})
    assert "slack" in res
    assert "email" in res
    assert "github" in res
    assert "webhooks" in res
    assert res["slack"]["enabled"] is False
    assert res["email"]["enabled"] is True


def test_get_integrations_custom():
    custom = {
        "slack": {"enabled": True, "webhook_url": "https://hooks.slack.com/services/123", "channel": "#alerts"},
        "email": {"enabled": False, "recipients": ["team@corp.io"]},
    }
    workspace = {"integrations_json": custom}
    res = plugins.get_integrations(workspace)
    assert res["slack"]["enabled"] is True
    assert res["slack"]["webhook_url"] == "https://hooks.slack.com/services/123"
    assert res["slack"]["channel"] == "#alerts"
    assert res["email"]["enabled"] is False
    assert res["email"]["recipients"] == ["team@corp.io"]


@pytest.mark.asyncio
async def test_test_ping_missing_urls():
    slack_test = await plugins.send_test_ping("slack", {"webhook_url": ""}, "ws_test")
    assert slack_test["ok"] is False
    assert "Missing Slack Webhook URL" in slack_test["message"]

    email_test = await plugins.send_test_ping("email", {"recipients": []}, "ws_test")
    assert email_test["ok"] is False
    assert "No recipient email" in email_test["message"]

    webhook_test = await plugins.send_test_ping("webhooks", {"endpoint_url": ""}, "ws_test")
    assert webhook_test["ok"] is False
    assert "Missing Webhook Endpoint" in webhook_test["message"]


@pytest.mark.asyncio
async def test_test_ping_email_simulation():
    email_test = await plugins.send_test_ping("email", {"recipients": ["sre@company.com"]}, "ws_test")
    assert email_test["ok"] is True
    assert "Maileroo" in email_test["message"]
    assert "Simulated delivery" in email_test["message"] or "dispatched" in email_test["message"]


@pytest.mark.asyncio
async def test_maileroo_dispatch_with_api_key(monkeypatch, respx_mock):
    from app.config import get_settings

    s = get_settings()
    monkeypatch.setattr(s, "maileroo_api_key", "test_maileroo_secret_key")

    mock_route = respx_mock.post("https://smtp.maileroo.com/send").respond(
        status_code=200, json={"success": True, "message": "Queued"}
    )

    alert = {"title": "Cascading Bypass", "rule_id": "R4"}
    integrations = {
        "email": {"enabled": True, "notify_on_critical": True, "recipients": ["ciso@corp.io"]}
    }

    results = await plugins.dispatch_alert_to_plugins("ws_prod", alert, integrations)
    assert results["email"]["ok"] is True
    assert results["email"]["provider"] == "maileroo"
    assert results["email"]["count"] == 1
    assert mock_route.called
    assert mock_route.calls.last.request.headers["x-api-key"] == "test_maileroo_secret_key"
