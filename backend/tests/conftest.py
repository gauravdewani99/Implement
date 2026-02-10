import pytest


@pytest.fixture
def sample_answers():
    """Sample answers for testing progress computation."""
    return {
        "ri_portal_type": "ReBound Portal",
        "ri_portal_languages": ["English", "German"],
        "ri_auth_method": "Order number + email",
        "ri_return_reason_required": "Yes - mandatory",
        "ri_return_reasons": "Too small\nDefective",
        "ri_photo_upload": "No",
        "ri_item_selection": "Yes - item-level selection",
        "ri_return_window": 30,
        "ri_extended_return": "No",
        "ri_non_returnable": ["Underwear"],
        "ri_refund_method": ["Original payment method"],
        "ri_rma_required": "No - auto-approve",
    }
