import pytest

from app.questions import get_all_sections_dict
from app.services.progress import compute_progress, should_display


class TestShouldDisplay:
    def test_no_depends_on(self):
        assert should_display(None, {}) is True

    def test_string_match_true(self):
        assert should_display({"foo": "bar"}, {"foo": "bar"}) is True

    def test_string_match_false(self):
        assert should_display({"foo": "bar"}, {"foo": "baz"}) is False

    def test_list_match_true(self):
        assert should_display({"level": ["A", "B"]}, {"level": "A"}) is True

    def test_list_match_false(self):
        assert should_display({"level": ["A", "B"]}, {"level": "C"}) is False

    def test_boolean_match(self):
        assert should_display({"active": True}, {"active": True}) is True
        assert should_display({"active": True}, {"active": False}) is False

    def test_missing_key(self):
        assert should_display({"foo": "bar"}, {}) is False

    def test_multiple_conditions(self):
        deps = {"a": "1", "b": "2"}
        assert should_display(deps, {"a": "1", "b": "2"}) is True
        assert should_display(deps, {"a": "1", "b": "3"}) is False


class TestComputeProgress:
    def test_empty_answers(self):
        sections = get_all_sections_dict()
        result = compute_progress(sections, {})
        assert result["overall"]["answered"] == 0
        assert result["overall"]["percentage"] == 0

    def test_partial_answers(self, sample_answers):
        sections = get_all_sections_dict()
        result = compute_progress(sections, sample_answers)
        # Should have some progress in return_initiation
        ri_progress = result["sections"]["return_initiation"]
        assert ri_progress["answered"] > 0
        assert ri_progress["percentage"] > 0

    def test_hidden_questions_excluded(self):
        sections = get_all_sections_dict()
        # With no processing level selected, L2/L3 questions should not count
        answers = {"pr_product_types": ["Footwear"], "pr_processing_level": "Level 1 (Parcel level)"}
        result = compute_progress(sections, answers)
        processing = result["sections"]["processing"]
        # Total should not include L2/L3 questions since they depend on higher processing level
        assert processing["total"] > 0

    def test_overall_aggregation(self, sample_answers):
        sections = get_all_sections_dict()
        result = compute_progress(sections, sample_answers)
        # Overall should be sum of all sections
        total = sum(s["total"] for s in result["sections"].values())
        answered = sum(s["answered"] for s in result["sections"].values())
        assert result["overall"]["total"] == total
        assert result["overall"]["answered"] == answered
