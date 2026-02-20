import pytest


@pytest.fixture
def sample_answers():
    """Sample answers for testing progress computation using real question keys."""
    return {
        # General — client_info
        "gen_client_name": "Test Brand Inc.",
        "gen_category": ["Fashion", "Electronics"],
        # General — primary_contact
        "gen_contact_name": "Jane Doe",
        "gen_contact_email": "jane@testbrand.com",
        "gen_contact_phone": "+44 20 1234 5678",
        # General — invoicing_entity
        "gen_inv_legal_entity": "Test Brand Ltd",
        "gen_inv_vat": "GB123456789",
        "gen_inv_currency": "GBP",
        "gen_inv_payment_term": "Net 30",
        "gen_inv_street": "High Street",
        "gen_inv_house_number": "42",
        "gen_inv_postcode": "EC1A 1BB",
        "gen_inv_city": "London",
        "gen_inv_state": "Greater London",
        "gen_inv_country": "United Kingdom",
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
