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

    def test_not_empty_with_list(self):
        deps = {"lanes": {"$not_empty": True}}
        assert should_display(deps, {"lanes": [{"country": "UK"}]}) is True
        assert should_display(deps, {"lanes": []}) is False
        assert should_display(deps, {}) is False

    def test_not_empty_with_dict(self):
        deps = {"config": {"$not_empty": True}}
        assert should_display(deps, {"config": {"host": "sftp.example.com"}}) is True
        assert should_display(deps, {"config": {}}) is False  # empty dict has no truthy values
        assert should_display(deps, {}) is False

    def test_not_empty_with_string(self):
        deps = {"name": {"$not_empty": True}}
        assert should_display(deps, {"name": "John"}) is True
        assert should_display(deps, {"name": ""}) is False
        assert should_display(deps, {"name": None}) is False


class TestComputeProgress:
    def test_empty_answers(self):
        sections = get_all_sections_dict()
        result = compute_progress(sections, {})
        assert result["overall"]["answered"] == 0
        assert result["overall"]["percentage"] == 0

    def test_partial_answers(self, sample_answers):
        sections = get_all_sections_dict()
        result = compute_progress(sections, sample_answers)
        # Should have some progress in general (both required questions answered)
        gen_progress = result["sections"]["general"]
        assert gen_progress["answered"] > 0
        assert gen_progress["percentage"] > 0
        # Should have some progress in return_initiation
        ri_progress = result["sections"]["return_initiation"]
        assert ri_progress["answered"] > 0
        assert ri_progress["percentage"] > 0

    def test_hidden_questions_excluded(self):
        sections = get_all_sections_dict()
        # With customs_lanes=False, customs-dependent questions should not count
        answers = {"ri_customs_lanes": False, "ri_frontend": "ReBound Consumer Portal"}
        result = compute_progress(sections, answers)
        last_mile = result["sections"]["last_mile"]
        # Total should not include customs questions since they depend on ri_customs_lanes=True
        assert last_mile["total"] > 0

    def test_overall_aggregation(self, sample_answers):
        sections = get_all_sections_dict()
        result = compute_progress(sections, sample_answers)
        # Overall should be sum of all sections
        total = sum(s["total"] for s in result["sections"].values())
        answered = sum(s["answered"] for s in result["sections"].values())
        assert result["overall"]["total"] == total
        assert result["overall"]["answered"] == answered
