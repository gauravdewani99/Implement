from typing import Any


def should_display(depends_on: dict | None, answers: dict[str, Any]) -> bool:
    """Check if a question should be displayed based on its dependencies."""
    if not depends_on:
        return True
    for key, expected in depends_on.items():
        actual = answers.get(key)
        if isinstance(expected, list):
            if actual not in expected:
                return False
        else:
            if actual != expected:
                return False
    return True


def compute_progress(
    sections: list[dict], answers: dict[str, Any]
) -> dict:
    """Compute multi-level progress from question definitions and answers.

    Returns:
        {
            "overall": {"answered": int, "total": int, "percentage": int},
            "sections": {"section_key": {"answered": int, "total": int, "percentage": int}},
            "subsections": {"subsection_key": {"answered": int, "total": int, "percentage": int}},
        }
    """
    overall_answered = 0
    overall_total = 0
    sections_progress: dict[str, dict] = {}
    subsections_progress: dict[str, dict] = {}

    for section in sections:
        section_key = section["key"]
        section_answered = 0
        section_total = 0

        for subsection in section.get("subsections", []):
            sub_key = f"{section_key}.{subsection['key']}"
            sub_answered = 0
            sub_total = 0

            for q in subsection.get("questions", []):
                if not q.get("required", False):
                    continue
                if not should_display(q.get("depends_on"), answers):
                    continue

                sub_total += 1
                answer = answers.get(q["key"])
                if answer is not None and answer != "" and answer != []:
                    sub_answered += 1

            subsections_progress[sub_key] = {
                "answered": sub_answered,
                "total": sub_total,
                "percentage": _pct(sub_answered, sub_total),
            }
            section_answered += sub_answered
            section_total += sub_total

        sections_progress[section_key] = {
            "answered": section_answered,
            "total": section_total,
            "percentage": _pct(section_answered, section_total),
        }
        overall_answered += section_answered
        overall_total += section_total

    return {
        "overall": {
            "answered": overall_answered,
            "total": overall_total,
            "percentage": _pct(overall_answered, overall_total),
        },
        "sections": sections_progress,
        "subsections": subsections_progress,
    }


def _pct(answered: int, total: int) -> int:
    if total == 0:
        return 100
    return round(answered / total * 100)
