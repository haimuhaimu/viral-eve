import assert from "node:assert/strict";
import test from "node:test";

import { CARD_POOL } from "../src/game/data/cards";
import { BRIEFING_MAP } from "../src/game/data/trends";
import { applyDayResult, simulateContent } from "../src/game/engine";
import { createInitialState } from "../src/game/state";
import type { ContentCard, ContentDraft } from "../src/game/types";

function card(category: string, id: string): ContentCard {
  const match = CARD_POOL[category].find((candidate) => candidate.id === id);
  assert.ok(match, `missing ${category} card ${id}`);
  return match;
}

test("adds expertise threshold tags on the day the threshold is crossed", () => {
  const initial = createInitialState();
  const state = {
    ...initial,
    metrics: {
      ...initial.metrics,
      expertise: 77,
    },
  };
  const draft: ContentDraft = {
    topic: card("topic", "topic_patch"),
    stance: card("stance", "stance_sincere"),
    format: card("format", "format_longform"),
    hook: card("hook", "hook_restrained"),
    sacrifice: card("sacrifice", "sac_allnighter"),
  };

  const result = simulateContent(state, draft, BRIEFING_MAP[1]);
  const next = applyDayResult(state, result);

  assert.equal(next.metrics.expertise, 85);
  assert.ok(
    result.newTags.includes("版本先知"),
    "expected the result to include the tag unlocked by the updated expertise",
  );
});

test("adds persona-drift threshold tags on the day the threshold is crossed", () => {
  const initial = createInitialState();
  const state = {
    ...initial,
    metrics: {
      ...initial.metrics,
      personaDrift: 71,
    },
  };
  const draft: ContentDraft = {
    topic: card("topic", "topic_op_rant"),
    stance: card("stance", "stance_pander"),
    format: card("format", "format_livecut"),
    hook: card("hook", "hook_suspense"),
    sacrifice: card("sacrifice", "sac_oldfans"),
  };

  const result = simulateContent(state, draft, BRIEFING_MAP[1]);
  const next = applyDayResult(state, result);

  assert.equal(next.metrics.personaDrift, 77);
  assert.ok(
    result.newTags.includes("整活顶流"),
    "expected the result to include the tag unlocked by the updated persona drift",
  );
});
