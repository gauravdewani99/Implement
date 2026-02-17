import pytest


@pytest.fixture
def sample_answers():
    """Sample answers for testing progress computation using real question keys."""
    return {
        # General
        "gen_client_name": "Test Brand Inc.",
        "gen_operating_countries": ["United Kingdom", "Germany", "France"],
        # Return Initiation — setup
        "ri_frontend": "ReBound Consumer Portal",
        "ri_api_integration": "REST API",
        "ri_customs_lanes": True,
        "ri_rgr_in_scope": False,
        "ri_refund_trigger": True,
        "ri_refund_level": "Item level",
        # Return Initiation — consumer_portal
        "ri_portal_journey": "Full journey (register → label → drop-off)",
        "ri_return_payer": "Brand",
        # Return Initiation — cs_portal
        "ri_cs_portal_enabled": True,
        "ri_cs_portal_features": ["Register returns", "View return status"],
    }
