#!/usr/bin/env python3
"""Generate the Uni UI Creator Program document set.

Run: python scripts/build_creator_docs.py

Regenerates all six PDFs from a single content definition, so the commission
tables, tier thresholds and payout rules cannot drift between documents. The
figures here are the same ones asserted by
`npm run verify:creator-commissions` (lib/creator-commissions.ts) — that script
is the source of truth and this is its printed form.

OUTPUT is public/creator-program/docs/ so the site can link them directly.
"""

from __future__ import annotations

import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parent))

from creator_docs_theme import (  # noqa: E402
    CONTENT_W,
    Doc,
    F,
    INK_FAINT,
    INK_SOFT,
    naira,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "creator-program" / "docs"

MM = 72 / 25.4  # points per mm, for readable layout maths

# ---------------------------------------------------------------------------
# The economics, in one place.
# Mirrors lib/creator-commissions.ts. Change here AND there together.
# ---------------------------------------------------------------------------

SCHOLAR_PRICE = 2500
DEEP_STUDY_PRICE = 10_000
DEEP_STUDY_CAP = 500
FOUNDING_BONUS_PCT = 2.5
RECURRING_MONTHS = 6
LTV = SCHOLAR_PRICE * 12  # 30,000
PAYOUT_MIN = 10_000
RECRUIT_BONUS = 2_500
NETWORK_SIZE = 500
FOUNDING_TIERS = [
    ("Founding 20", 20, 20, 12_450),
    ("Founding 100", 80, 100, 4_000),
    ("Founding 500", 400, 500, 1_200),
]
NETWORK_TOTAL = sum(size * cost for _, size, _, cost in FOUNDING_TIERS) + 575_000

TIERS = [
    # id, label, min, max, first %, recurring %, founding first %, founding rec %
    ("starter", "Starter", 0, 9, 10.0, 5.0, 12.5, 7.5),
    ("growing", "Growing", 10, 49, 12.5, 7.5, 15.0, 10.0),
    ("established", "Established", 50, 199, 15.0, 10.0, 17.5, 12.5),
    ("top", "Top", 200, None, 20.0, 10.0, 22.5, 12.5),
]


def tier_rows():
    """(label, range, std first, std rec x6, std total, founding total)."""
    out = []
    for _, label, lo, hi, f, r, ff, fr in TIERS:
        rng = f"{lo}–{hi}" if hi is not None else f"{lo}+"
        std_first = SCHOLAR_PRICE * f / 100
        std_rec = SCHOLAR_PRICE * r / 100
        std_total = std_first + std_rec * RECURRING_MONTHS
        fnd_total = SCHOLAR_PRICE * ff / 100 + SCHOLAR_PRICE * fr / 100 * RECURRING_MONTHS
        out.append((label, rng, std_first, std_rec, std_total, fnd_total))
    return out


def money(v: float) -> str:
    return naira(round(v, 2))


# ===========================================================================
# DOC 02 — Creator Program Overview
# ===========================================================================


def doc_overview() -> None:
    with Doc(
        OUT / "02_creator_program_overview.pdf",
        doc_id="DOC 02",
        title="Creator Program Overview",
        eyebrow="Recruitment · Program Overview",
    ) as d:
        d.cover(
            kicker="Recruitment",
            title=("Creator Program", "Overview"),
            standfirst=(
                "A student creator opportunity built around real campus voices and "
                "useful academic content."
            ),
            tagline=("Create. Share.", "Refer. Earn."),
            meta=(
                "Pre-launch. Program details may be updated. Earnings are conditional on "
                "qualifying activity and on the Creator Program Terms. This document is a "
                "plain-language summary, not legal advice."
            ),
        )

        d.section("01", "What this is", intro=(
            "A pre-launch network of Nigerian student creators building with UNIUI. You do "
            "not need a large following. You need to be a student who creates content, shares "
            "useful ideas and can speak in your own voice. The program combines practical "
            "creator training with performance-based earnings."
        ))

        d.cards(
            [
                (
                    "Not this",
                    "It is not an ambassador role",
                    "Ambassadors earn for recruiting effort on campus. Creators earn for "
                    "audience reach. If you fit both, you choose one — the two never stack.",
                ),
                (
                    "Not this",
                    "It is not a multi-level scheme",
                    "There is no downline and no override. A creator who refers another "
                    "creator earns a one-time bonus. It does not compound.",
                ),
                (
                    "Not this",
                    "It is not a contract",
                    "No minimum term. No exclusivity. You may leave at any time and still "
                    "collect qualifying commissions already earned.",
                ),
            ],
            cols=3,
        )

        d.subhead("What you get")
        d.bullets([
            "A unique referral link for launch attribution, plus a dashboard showing clicks, "
            f"signups, activated users and earnings.",
            f"{FOUNDING_BONUS_PCT}% added to every commission rate for the first 20 approved "
            "creators, permanently.",
            f"{RECURRING_MONTHS} months of recurring commission on every subscriber you bring, "
            "not a one-off payment.",
            "Exclusive campaigns and early access to V2 before the public launch.",
            "A creator WhatsApp community and a feedback council for the top performers.",
            "Content resources: logos, screenshots, demo videos, hooks and campaign briefs.",
        ])

        d.subhead("What you build")
        d.cards(
            [
                ("Skill", "Demonstration", "Confidence showing an academic product honestly, "
                 "including where it falls short."),
                ("Skill", "A portfolio", "A body of useful, credible content you keep after "
                 "the program ends."),
                ("Skill", "A peer network", "Working creators across Nigerian campuses, and a "
                 "direct line to the product team."),
            ],
            cols=3,
        )

        d.section("02", "How you are paid", intro=(
            "Commission is a percentage of what a subscriber pays, not a flat fee. It scales "
            "automatically with the number of paying subscribers you bring, so the same "
            "content earns more as your audience converts."
        ))

        rows = []
        for label, rng, sf, sr, st, ft in tier_rows():
            rows.append([
                label, rng,
                f"{money(sf)} + {money(sr)}×{RECURRING_MONTHS}",
                money(st), money(ft),
            ])

        d.text(
            f"Per subscriber who pays for the {naira(SCHOLAR_PRICE)} Scholar subscription. "
            f"The final column is what a founding creator earns on the same subscriber.",
        )
        d.table(
            ["Tier", "Subscribers", "Per subscriber", "Total", f"Founding (+{FOUNDING_BONUS_PCT}%)"],
            rows,
            widths=[CONTENT_W * 0.17, CONTENT_W * 0.15, CONTENT_W * 0.28, CONTENT_W * 0.20, CONTENT_W * 0.20],
            align_right=[2, 3, 4],
        )

        d.callout(
            "Why this stays affordable",
            f"At the top tier you pay 6.7% of a subscriber's lifetime value, and a founding "
            f"creator takes it to 8.1%. On a {naira(LTV)} lifetime value that is cheaper than "
            "the ₦3,000–₦8,000 a paid ad costs to acquire the same student, and it lands with "
            "someone they already trust.",
        )

        d.subhead("The one product with a cap")
        d.text(
            f"{naira(DEEP_STUDY_PRICE)} Deep Study is a one-time purchase, not a subscription, "
            "so it earns no recurring commission. Its commission is capped at "
            f"{money(DEEP_STUDY_CAP)} so a single sale can never consume the margin on that "
            "product."
        )

        d.section("03", "How the programme works", intro=(
            "You do not wait for the product. The network launches now and your link is issued at "
            "approval. V2 arrives later, into an audience you have already built."
        ))

        d.steps([
            ("01 · Apply", "Submit the creator application.",
             "Tell us who you are, what you post, and how you would introduce the network to your audience."),
            ("02 · Get approved", "Receive confirmation and next steps.",
             "We review every application within 48 hours against the vetting criteria, and tell you either way."),
            ("03 · Join the community", "Meet the network.",
             "Get access to resources, campaign updates and direct support from the team."),
            ("04 · Get your slug", "Issued at approval, not at launch.",
             "Your referral slug and dashboard go live immediately. This is the single most "
             "important difference from a product launch programme."),
            ("05 · Build for three weeks", "Identify, demonstrate, build.",
             "Set up your creator identity, practise a demonstration, and start publishing network "
             "content. You are posting throughout, not after."),
            ("06 · Keep building", "Ongoing network growth.",
             "Study tips, campus content, creator life. When V2 launches you accelerate into an "
             "audience that already trusts you."),
        ])

        d.callout(
            "Why the immediate start matters",
            "A network that only begins at launch starts cold. A network that has been running for "
            "six weeks launches warm. By V2 you should have an audience, a backlog of content and "
            "momentum — so launch becomes a spike rather than a start.",
        )

        d.subhead("The six-week runway")
        d.cards(
            [
                ("Week 1", "IDENTIFY",
                 "Onboard, understand the network, set up your profile. Publish your introduction post."),
                ("Week 2", "LEARN THE TOOLS",
                 "Test your dashboard, meet the other creators. Publish behind-the-scenes content."),
                ("Week 3", "BUILD",
                 "Start network-building content. Publish “join my network” posts carrying your slug."),
                ("Week 4", "FIRST CAMPAIGN",
                 "Publish “the problem I am solving for students”."),
                ("Week 5+", "KEEP GOING",
                 "Study tips, campus content, creator life — your normal content, affiliated."),
                ("At V2", "ACTIVATE",
                 "Coordinated launch content into a warm audience."),
            ],
            cols=3,
        )

        d.section("04", "What you post before the product exists", intro=(
            "Six content pillars that need no product, no demo and no pitch. The rule underneath "
            "them is simple and it is the whole strategy."
        ))
        d.cards(
            [
                ("Pillar", "The Journey",
                 "“Day 1 as a Founding Creator.” Builds your brand and makes the network visible."),
                ("Pillar", "The Problem",
                 "“Why studying in Nigeria is broken.” Sets up the solution without ever pitching it."),
                ("Pillar", "The Build",
                 "“What I am building with 500 other creators.” Creates anticipation and momentum."),
                ("Pillar", "The Tips",
                 "“3 study hacks I actually use.” Your normal content, with a subtle affiliation."),
                ("Pillar", "The Network",
                 "“Meet the other Founding Creators.” Cross-promotion and community growth."),
                ("Pillar", "The Countdown",
                 "“Something is coming. Here is what I know.” Anticipation and exclusivity."),
            ],
            cols=3,
        )

        d.callout(
            "The rule",
            "Never pitch the product before it exists. Pitch the journey, the problem and your own "
            "story. When V2 lands, you pivot to product content into an audience that already "
            "trusts you.",
            kind="warn",
        )

        d.callout(
            "The metric that matters",
            "Not how many creators post on launch day. How large the network's combined audience is "
            "by launch day. Five hundred creators averaging 1,000 engaged followers is a warm "
            "audience of 500,000 — and that is the asset.",
        )

        d.section("05", "Founding spots are tiered by order of entry", intro=(
            f"All {NETWORK_SIZE} founding creators hold permanent numbered status. The earlier "
            "cohorts carry a larger cash bundle."
        ))
        tier_rows_pdf = []
        for name, size, cumulative, cost in FOUNDING_TIERS:
            carries = (
                "Includes the permanent +2.5% commission bump"
                if size == 20
                else "Creator access, currency, status"
            )
            tier_rows_pdf.append([name, str(size), f"first {cumulative}", money(cost), carries])

        d.table(
            ["Cohort", "Spots", "Cumulative", "Cash bundle each", "What it carries"],
            tier_rows_pdf,
            widths=[CONTENT_W * 0.16, CONTENT_W * 0.10, CONTENT_W * 0.15,
                    CONTENT_W * 0.19, CONTENT_W * 0.40],
            align_right=[1, 3],
            highlight={0},
        )
        d.text(
            f"Referral bonuses across the network add {money(575_000)}, bringing the total cash "
            f"cost of the full network to {money(NETWORK_TOTAL)}. Commission rates are identical "
            "across all cohorts except the first twenty.",
            size=8.5,
        )

        d.section("06", "Who this is for", intro=(
            "We select on audience relevance and genuine engagement, not follower count. A "
            "student with 2,000 real campus followers is worth more to this programme than an "
            "account with 30,000 people who will never buy an academic tool."
        ))
        d.cards(
            [
                ("Criterion", "Nigerian student",
                 "You attend a Nigerian university or polytechnic."),
                ("Criterion", "Actively posting",
                 "You have posted on TikTok or Instagram in the last 14 days."),
                ("Criterion", "Relevant content",
                 "Study, campus life, exam prep, tech or lifestyle."),
                ("Criterion", "Genuine engagement",
                 "Real comments and replies, not just likes. Comments are the signal we look for first."),
                ("Criterion", "Micro or nano",
                 "Between 500 and 5,000 followers is the target band."),
                ("Criterion", "Reliable cadence",
                 "Willing to post at least twice a week during active campaigns."),
            ],
            cols=3,
        )
        d.callout(
            "How selection works",
            "Four or more yeses is an approval. Two or fewer is a decline. Three is held for "
            "review, and we will tell you which criterion was unclear. We review every "
            "application within 48 hours either way — you will not be left guessing.",
        )

        d.callout(
            "Ready to apply?",
            "Apply at waitlist.uniui.com.ng/creators. Referral attribution, eligibility and "
            "payment details are governed by the separate Creator Program Terms.",
        )
        d.text(
            "Program details are pre-launch and may be updated. Earnings are conditional on "
            "qualifying activity and on the Creator Program Terms.",
            size=8.5,
            color=INK_FAINT,
        )


# ===========================================================================
# DOC 04 — Week 1 Onboarding Pack
# ===========================================================================


def doc_week1() -> None:
    with Doc(
        OUT / "04_week1_onboarding_pack.pdf",
        doc_id="DOC 04",
        title="Week 1 Onboarding Pack",
        eyebrow="Training · Week 1",
    ) as d:
        d.cover(
            kicker="Training",
            title=("Week 1", "Onboarding Pack"),
            standfirst=("Set up your creator identity and understand the network. Your link is "
                        "already live — you are publishing this week."),
            tagline=("Identify", "yourself."),
            meta=("Week 1 of 3 · Two tasks: publish your introduction post, and get the product "
                  "clear enough to talk about it. Features described here must be verified "
                  "against the live product before you post."),
        )

        d.section("00", "You are already live", intro=(
            "This is the part that differs from every other creator programme. Your referral slug "
            "and dashboard were issued at approval, not at product launch. Nothing in your first "
            "six weeks is waiting on V2."
        ))

        d.cards(
            [
                ("Already done", "Your slug",
                 "Permanent, yours, live now. Anyone who joins through it is credited to you from "
                 "day one."),
                ("Already done", "Your dashboard",
                 "Clicks, signups, earnings and network growth, from the moment you were approved."),
                ("This week", "Your introduction post",
                 "Tell your existing audience you are building something. You do not need a "
                 "product to do this, and you do not need to wait."),
                ("This week", "Product understanding",
                 "Use your creator access so that when you do talk about UNIUI, you are credible."),
            ],
            cols=4,
        )

        d.callout(
            "The only rule for this week",
            "Post about the journey, not the product. “I have just joined a network of 500 student "
            "creators” is true, interesting and safe. “I am promoting an AI app” is neither.",
        )

        d.section("01", "What is UNIUI?", intro=(
            "An AI academic platform for Nigerian university students. UNIUI is designed to "
            "help students ask academic questions, work with course materials and study with "
            "more context. The core idea in one line: course-grounded learning, built for "
            "Nigerian campuses."
        ))

        d.callout(
            "Say it naturally",
            "“UNIUI helps me work through academic questions with my course context in "
            "view.” Use wording that reflects your own experience. Do not imply that every "
            "feature or release is available today.",
        )

        d.section("02", "The student problem", intro=(
            "Every creator in this program is solving the same problem for the same audience. "
            "If you can name it accurately, your content writes itself."
        ))
        d.cards(
            [
                ("Problem", "Fragmented search",
                 "Answers take time to find. Students can spend hours searching across chats, "
                 "folders and general web results."),
                ("Problem", "Scattered material",
                 "Past questions get buried in shared files and hard-to-search folders, so the "
                 "useful paper is the one nobody can locate."),
                ("Problem", "Missing context",
                 "A broad answer may not reflect a student's actual course materials or "
                 "semester, which is usually what they needed."),
                ("Problem", "Trust deficit",
                 "Students have been burned by AI tools that sound confident and are simply "
                 "wrong. Showing sources is the differentiator."),
            ],
            cols=2,
        )

        d.section("03", "How UNIUI is designed to help", intro=(
            "Four steps in the intended student workflow. Use these as the backbone of your "
            "Week 1 content."
        ))
        d.cards(
            [
                ("Step 01", "Ask",
                 "Ask an academic question in the context of the material actually available to you."),
                ("Step 02", "Verify",
                 "Review cited source material and confidence cues where the product provides them."),
                ("Step 03", "Organize",
                 "Find course notes and past-question resources where available."),
                ("Step 04", "Practise",
                 "Use study routines or streak features only where available in the current release."),
            ],
            cols=4,
        )

        d.section("04", "Feature tour", intro=(
            "Four illustrative concepts. These are concept mockups built from the program "
            "brief, not product screenshots. Availability, labels and release status must be "
            "checked against the current UNIUI product before you post."
        ))
        d.cards(
            [
                ("01 · Ask", "Ask a question",
                 "Course context · BIO 201 — “Help me understand today's lecture.” "
                 "Add your own question before asking."),
                ("02 · Check", "Answer with sources",
                 "Answer confidence · review. Source: uploaded lecture notes, section 3. "
                 "Open the source and check the fit."),
                ("03 · Find", "Past questions",
                 "Course · BIO 201. Topic: cell biology · Year: 2024. Filter course material "
                 "where available."),
                ("04 · Practise", "Study routine",
                 "A short review session for today. Streak and reward details depend on release."),
            ],
            cols=2,
        )

        d.callout(
            "Your Week 1 task — two parts",
            "Part one, publish: post your introduction to the network. Part two, prepare: use your "
            "creator access and ask three genuine academic questions. Save a screenshot only if the "
            "product and your account permit it, and remove private information before sharing. "
            "Post in the group: “This is what I found.”",
        )

        d.section("05", "What makes a good Week 1 post", intro=(
            "You are not selling anything yet. You are establishing that you actually used "
            "the product, which is what makes everything you post later credible."
        ))
        d.cards(
            [
                ("Do", "Be specific",
                 "Name the course and the concept. “BIO 201 cell biology” beats “my coursework.”"),
                ("Do", "Show the honest result",
                 "Include what was clear, what was useful, and what you would verify yourself."),
                ("Do", "Admit limits early",
                 "Saying “I still checked this against my notes” builds more trust than a "
                 "flawless demo."),
                ("Don't", "Post a testimonial you did not write",
                 "Never copy a quote from another creator, even one that sounds like you."),
                ("Don't", "Expose private material",
                 "No grades, student IDs, unpublished exam content, or any screenshot showing "
                 "another person."),
                ("Don't", "Claim grades",
                 "Never say UNIUI guarantees anything. See the Approved Claims guide."),
            ],
            cols=3,
        )

        d.section("06", "Week 1 checklist")
        d.checklist([
            ("Understand — before you talk about it", [
                "I can explain what UNIUI is in one sentence.",
                "I know which features I personally tried.",
                "I can distinguish available features from concepts or planned features.",
                "I can name the student problem in my own words.",
            ]),
            ("Experience — when you try UNIUI", [
                "I asked three real academic questions.",
                "I checked any source shown against the answer.",
                "I noted what was clear, useful, uncertain or missing.",
                "I recorded which features existed in my account today.",
            ]),
            ("Share — before posting", [
                "I removed names, student IDs and private course content.",
                "I labelled any concept visuals as illustrative.",
                "I disclosed that I am a UNIUI creator.",
                "I asked the group about anything I was unsure of.",
            ]),
        ])

        d.callout(
            "Group post prompt",
            "“I tried UNIUI for [course/topic]. I asked [general question]. What stood out was "
            "[your honest observation]. I'm a UNIUI creator, and this is my experience.”",
        )
        d.text(
            "Do not post grades, private student data, unpublished exam material, or "
            "screenshots that expose another person's information.",
            size=8.5,
            color=INK_FAINT,
        )

        d.section("07", "Questions creators actually get asked", intro=(
            "Prepare your honest answer to each of these in Week 1. Being caught off guard "
            "with a hard question on camera is how creators end up overclaiming."
        ))
        d.cards(
            [
                ("Q", "Is it accurate?",
                 "It gives answers with sources, so you can check it. I check anything "
                 "important against the source it shows."),
                ("Q", "Will this get me an A?",
                 "No tool guarantees a grade. I use it to understand a topic faster, then I "
                 "still read my course materials."),
                ("Q", "Does it do my assignment?",
                 "No. It helps me understand concepts. The submitted work is mine."),
                ("Q", "Is it free?",
                 "Check the current offer before answering this — it changes. If you are not "
                 "sure, say so."),
                ("Q", "Which courses does it cover?",
                 "It works with material you provide, so the useful part is what you upload. "
                 "Describe what you actually did."),
                ("Q", "Does my school endorse it?",
                 "No, unless we have said so publicly. Do not imply school endorsement."),
            ],
            cols=2,
        )

        d.callout(
            "When you do not know",
            "“I'm not sure about that — I'll check and come back to you” is a complete, "
            "credible answer. Guessing on camera is how a good creator becomes a risky one.",
        )


# ===========================================================================
# DOC 05 — Week 2 Product Demonstration Guide
# ===========================================================================


def doc_week2() -> None:
    with Doc(
        OUT / "05_week2_product_demonstration_guide.pdf",
        doc_id="DOC 05",
        title="Week 2 Product Demonstration Guide",
        eyebrow="Training · Week 2",
    ) as d:
        d.cover(
            kicker="Training",
            title=("Week 2", "Demonstration Guide"),
            standfirst=("Make the value visible in under 60 seconds, and make it obvious "
                        "that you tested it yourself."),
            tagline=("Show the product", "honestly."),
            meta=("Week 2 of 3 · Ends with one demo video posted in the creator group for "
                  "feedback. Feedback is for improvement, not a requirement to publish."),
        )

        d.section("01", "Choose a demo format", intro=(
            "Pick the format that feels natural to you. All three are equally acceptable; "
            "consistency with your existing content matters more."
        ))
        d.cards(
            [
                ("Format 01", "Screen recording + voiceover",
                 "Capture the relevant product flow, then narrate what you tried and what you "
                 "noticed. Keep the screen legible and hide private details."),
                ("Format 02", "Face-to-camera + screen",
                 "Open with your real question or reaction, then show the relevant screen. Make "
                 "clear what you personally tested."),
                ("Format 03", "Text overlay + screen",
                 "Use a short on-screen question or observation, then show the flow. Keep every "
                 "claim accurate and readable."),
            ],
            cols=3,
        )

        d.callout(
            "The standard",
            "A good demo helps another student understand one thing UNIUI can do. It does not "
            "promise grades, replace learning, or pretend a planned feature is already live.",
        )

        d.section("02", "Build a clear 60-second demo", intro=(
            "A simple rhythm, not a script. Timings are guidance — if your hook needs twelve "
            "seconds, take twelve seconds."
        ))
        d.steps([
            ("OPEN", "0–5 sec · The hook",
             "Name a real course question, study moment or curiosity. Avoid exaggerated "
             "“miracle” language."),
            ("CONTEXT", "5–15 sec · The context",
             "Say what you are testing and why it matters to your study session right now."),
            ("DEMO", "15–40 sec · The product",
             "Show the actual flow you used. Pause on the answer and on any source or "
             "confidence cue that is genuinely available."),
            ("REACT", "40–52 sec · Your reaction",
             "Share one honest observation: useful, surprising, unclear, or something you "
             "would double-check."),
            ("DISCLOSE", "52–60 sec · Close",
             "Invite viewers to learn more, disclose your creator relationship, and use the "
             "approved tag."),
        ])

        d.subhead("Hooks to adapt")
        d.cards(
            [
                ("Hook", "“I asked UNIUI my hardest question…”",
                 "Only use it if it truly was a challenging question for your course."),
                ("Hook", "“Can AI actually answer this?”",
                 "Show what happened, including uncertainty or a limitation. This hook "
                 "performs well because the honest answer is interesting."),
                ("Hook", "“Testing this AI on my coursework”",
                 "Do not show private assignment instructions or submit AI output as your own "
                 "work."),
                ("Hook", "“Three things UNIUI got right that I didn't expect”",
                 "Keep each point specific to your actual test, or do not use it."),
                ("Hook", "“If you're a [course] student, watch this”",
                 "Use a course-relevant question and avoid implying official school endorsement."),
                ("Hook", "“I was wrong about this AI tool”",
                 "Only if you genuinely were. A correction is more credible than a recommendation."),
            ],
            cols=3,
        )

        d.section("03", "Quality check", intro=(
            "Run this before you send anything. It takes about thirty seconds and catches "
            "almost every reason a demo gets pulled."
        ))
        d.checklist([
            ("Prep — before you record", [
                "I chose a real question I am comfortable sharing.",
                "I checked whether the product is available and the feature is live.",
                "I used my own account and removed personal or confidential data.",
                "I recorded somewhere quiet and well-lit with clear audio.",
            ]),
            ("Capture — while you record", [
                "I kept the key screen visible and readable.",
                "I reacted naturally and did not manufacture surprise.",
                "I showed sources or confidence cues only if they appeared in my actual session.",
                "I kept the final cut under 60 seconds.",
            ]),
            ("Review — before you send", [
                "I checked every factual claim against the product.",
                "I added “I'm a UNIUI creator” or #UniUICreator.",
                "I tagged @UniUI where appropriate.",
                "I asked the group if anything feels uncertain.",
            ]),
        ])

        d.callout(
            "Your Week 2 task",
            "Record one demo video and post it in the creator group for feedback. Include: "
            "the question you tested, what happened, one genuine reaction, and your disclosure. "
            "Feedback is for improvement — it is not a requirement to publish every draft.",
        )

        d.callout(
            "Academic integrity",
            "Never frame UNIUI as doing a student's assignment. Follow your institution's "
            "academic-integrity rules. Submitting AI output as your own work is a violation at "
            "almost every Nigerian university, and it puts your account — not just your "
            "commission — at risk.",
            kind="warn",
        )

        d.section("04", "Common failure modes", intro=(
            "These are the five reasons demos get rejected in the group. None of them are "
            "about production quality."
        ))
        d.cards(
            [
                ("Failure", "The 30-second feature tour",
                 "You showed everything instead of one thing. A viewer remembers one idea, not "
                 "a tour of a product."),
                ("Failure", "The unverified claim",
                 "You said a feature was live because you saw it in a mockup. Check the live "
                 "product or drop the claim."),
                ("Failure", "The manufactured reaction",
                 "Your face performs surprise you did not feel. Viewers read this instantly and "
                 "stop trusting the rest of the post."),
                ("Failure", "The unreadable screen",
                 "The key text is too small to read on a phone. Zoom in, or crop to the one "
                 "element that matters."),
                ("Failure", "The buried disclosure",
                 "#UniUICreator is hidden at the end under twelve other hashtags. Put it where "
                 "it is readable."),
                ("Failure", "The missing next step",
                 "The video ends without telling anyone what to do. Close with one clear action."),
            ],
            cols=2,
        )

        d.section("05", "Captions, titles and thumbnails", intro=(
            "The demo is only half the post. How it is packaged decides whether anyone reaches "
            "the demonstration at all."
        ))
        d.cards(
            [
                ("Do", "Put the question in the title",
                 "“Can AI actually answer this cell biology question?” beats “Study tool "
                 "recommendation.” Specific questions get clicked."),
                ("Do", "Write a first comment with detail",
                 "Put your longer explanation, the course context and your disclosure in the "
                 "first comment so the video reads cleanly."),
                ("Do", "Use 3 to 5 relevant hashtags",
                 "Mix broad and niche: #studytoknigeria alongside #bio201. Do not stack thirty."),
                ("Don't", "Use clickbait you cannot pay off",
                 "If the title promises “I got an A,” the video cannot deliver it honestly, and "
                 "that is a claim violation."),
                ("Don't", "Post the same video everywhere",
                 "Re-edit the caption and hook per platform. Cross-posting identical content "
                 "reads as automated."),
                ("Don't", "Hide the disclosure in the caption",
                 "On TikTok and Instagram, put it in the video itself as well as the caption."),
            ],
            cols=3,
        )


# ===========================================================================
# DOC 06 — Week 3 Content Playbook + Campaign Briefs
# ===========================================================================


def doc_week3() -> None:
    with Doc(
        OUT / "06_week3_content_playbook_campaign_briefs.pdf",
        doc_id="DOC 06",
        title="Week 3 Content Playbook + Campaign Briefs",
        eyebrow="Training · Week 3",
    ) as d:
        d.cover(
            kicker="Training",
            title=("Week 3", "Content Playbook"),
            standfirst=("Campaigns give you a direction, not a script. Your audience already "
                        "trusts your voice — do not replace it."),
            tagline=("Prepare content", "that feels real."),
            meta=("Week 3 of 3 · Six campaigns, content rules, and the worksheet for drafting "
                  "your own ideas before launch."),
        )

        d.section("01", "The campaign principle", intro=(
            "Start with a useful idea. Tell it in your own voice. Choose a campaign angle that "
            "fits your course and your real experience. Make the post useful to another "
            "student, show only what you have actually tested, and disclose your creator "
            "relationship."
        ))

        d.section("02", "The six pre-launch pillars", intro=(
            "You start posting before the product exists, so these six pillars are your entire "
            "content plan until V2 lands. None of them require a demo, a screenshot or a pitch."
        ))
        d.cards(
            [
                ("Pillar 01", "The Journey",
                 "“Day 1 as a Founding Creator.” Builds your creator brand and makes the network "
                 "visible to people already watching you."),
                ("Pillar 02", "The Problem",
                 "“Why studying in Nigeria is broken.” Sets up the solution without ever pitching "
                 "it. This is the pillar that makes launch convert later."),
                ("Pillar 03", "The Build",
                 "“What I am building with 500 other creators.” Creates anticipation, and makes "
                 "joining feel like momentum rather than a job."),
                ("Pillar 04", "The Tips",
                 "“3 study hacks I actually use.” Your normal content, with a subtle affiliation "
                 "to the network. Consistency here compounds fastest."),
                ("Pillar 05", "The Network",
                 "“Meet the other Founding Creators.” Cross-promotion, and it grows the network "
                 "itself while growing your reach."),
                ("Pillar 06", "The Countdown",
                 "“Something is coming. Here is what I know.” Anticipation, plus a concrete reason "
                 "for your audience to keep following you until it drops."),
            ],
            cols=2,
        )

        d.callout(
            "The rule underneath all six",
            "Never pitch the product before it exists. Pitch the journey, the problem and your own "
            "story. When V2 lands you pivot to product content — into an audience that already "
            "trusts you. A creator who spends six weeks pitching something that does not exist "
            "loses the only advantage they had: credibility.",
            kind="warn",
        )

        d.section("04", "The six campaigns", intro=(
            "Campaigns run from launch onward. You may also run any of these on your own "
            "initiative — but you must still follow the content rules and disclose."
        ))
        d.cards(
            [
                ("Campaign 01", "Meet UNIUI",
                 "Introduce the platform: what it is, who it is designed for, and why you chose "
                 "to try it. Prompts: “One study problem I want to make easier”; “What "
                 "course-grounded AI means to me”; “My first impression.”"),
                ("Campaign 02", "Test UNIUI",
                 "Ask UNIUI a difficult academic question, show the actual answer, and share "
                 "your honest reaction. Prompts: one concept from a real lecture; a question "
                 "with a checkable source; what you would verify next."),
                ("Campaign 03", "Can AI get this right?",
                 "Explore how confidence cues and sources help you judge an answer. Show both "
                 "what seems supported and what remains uncertain. Prompts: source check; "
                 "compare with your notes; show a limitation honestly."),
                ("Campaign 04", "My semester with UNIUI",
                 "Document real use over time rather than presenting one interaction as proof "
                 "of results. Prompts: a weekly study check-in; what changed in your workflow; "
                 "one thing you still verify manually."),
                ("Campaign 05", "UNIUI Challenge",
                 "Create the most useful academic demonstration you can. Keep it fair, "
                 "course-specific and grounded in real product behaviour. Prompts: explain a "
                 "tricky idea; a short source-check walkthrough; invite peers to suggest a "
                 "question."),
                ("Campaign 06", "Launch Week",
                 "The coordinated push around the V2 launch. Every active creator posts in the "
                 "launch window. Briefs and timing are issued by the team; this is the highest "
                 "visibility campaign of the year."),
            ],
            cols=2,
        )

        d.subhead("Campaign brief — fill this in before recording")
        d.cards(
            [
                ("Plan", "My audience",
                 "Which students or course cohort will find this useful?"),
                ("Plan", "My point",
                 "What is the one thing a viewer should understand or learn?"),
                ("Plan", "My proof",
                 "What real product interaction, source or personal observation supports it?"),
                ("Plan", "My boundary",
                 "What should I avoid claiming, showing or exposing?"),
            ],
            cols=4,
        )

        d.section("05", "Content rules", intro=(
            "Trust is the campaign. Protect it in every post — a single overclaim costs you "
            "more commission than a month of good posts earns."
        ))
        d.cards(
            [
                ("Do", "Use your own voice",
                 "Campaigns are prompts, not scripts. Do not copy a testimonial or claim that "
                 "does not match your experience."),
                ("Do", "Disclose clearly",
                 "Every post must include “I'm a UNIUI creator” or #UniUICreator. Tag @UniUI "
                 "where appropriate."),
                ("Do", "Show what is real",
                 "Only demonstrate features available to you. Label concept visuals as "
                 "illustrative and do not present them as a live product screen."),
                ("Do", "Keep academic integrity",
                 "Do not say UNIUI guarantees grades or does assignments. Do not share "
                 "confidential assessment material."),
                ("Do", "Respect people and schools",
                 "Get permission before showing other people. Avoid implying official university "
                 "endorsement unless approved."),
                ("Do", "Be constructive",
                 "No competitor claims, fake engagement, spam or fabricated results. Ask the "
                 "team if a claim is unclear."),
            ],
            cols=3,
        )

        d.callout(
            "Your Week 3 task",
            "Pick two campaigns. Draft three video ideas for each — six ideas in total. For "
            "every idea, include the audience, the one-sentence point, the real proof you will "
            "show, and your disclosure. Post your ideas in the group for feedback.",
        )

        d.section("06", "Idea worksheet", intro=(
            "Six starting points for your own concepts. Write in your own words — the point of "
            "the worksheet is to get your thinking down, not to produce finished scripts."
        ))
        d.worksheet([
            ("Draft", ["Campaign 1 · Idea A", "Campaign 1 · Idea B", "Campaign 1 · Idea C"]),
            ("Draft", ["Campaign 2 · Idea A", "Campaign 2 · Idea B", "Campaign 2 · Idea C"]),
        ])
        d.callout(
            "Before you submit",
            "Include which two campaigns you chose, your six ideas, one disclosure line, and "
            "any product detail you want the team to verify.",
        )

        d.section("07", "Posting cadence", intro=(
            "Two posts a week during an active campaign is the commitment. Consistency matters "
            "more than intensity — a creator who posts reliably at lower frequency out-earns "
            "one who posts three times in one week and then disappears."
        ))
        d.cards(
            [
                ("Cadence", "Baseline",
                 "Two posts per week while a campaign is active. Pick fixed days so your "
                 "audience learns when to expect you."),
                ("Cadence", "Launch week",
                 "Post in the launch window. Briefs and timing are issued by the team."),
                ("Cadence", "Between campaigns",
                 "Post when you have something genuinely useful. You are not obligated to post "
                 "when there is no brief."),
                ("Cadence", "Minimum for Active status",
                 "Two posts per week for four consecutive weeks earns Active status."),
            ],
            cols=2,
        )

        d.section("08", "Reading your own numbers", intro=(
            "Views are not what you are paid on. Understanding which numbers actually move "
            "your commission stops you optimising for the wrong thing."
        ))
        d.cards(
            [
                ("Metric", "Clicks",
                 "How many people opened your referral link. High clicks with low signups means "
                 "your hook over-promises relative to the landing page."),
                ("Metric", "Registrations",
                 "How many people created an account. This is the first number that predicts "
                 "commission."),
                ("Metric", "Activated users",
                 "Registered, uploaded material and asked a real question. This is what the "
                 "leaderboard ranks on."),
                ("Metric", "Paying subscribers",
                 "Activated users who subscribe. This is what sets your commission tier."),
                ("Metric", "Earnings",
                 "Your accrued commission after the hold period. What you have actually earned "
                 "versus what is still held."),
                ("Metric", "Reach",
                 "Useful for judging content, not for judging income. Do not chase it."),
            ],
            cols=3,
        )

        d.callout(
            "The honest optimisation",
            "The highest-earning creators are usually not the biggest accounts. They are the "
            "ones whose content sets an accurate expectation, so the people who click actually "
            "want what they get.",
        )


# ===========================================================================
# DOC 07 — Approved Claims & Messaging Guide
# ===========================================================================


def doc_claims() -> None:
    with Doc(
        OUT / "07_approved_claims_messaging_guide.pdf",
        doc_id="DOC 07",
        title="Approved Claims & Messaging Guide",
        eyebrow="Protection · Messaging",
    ) as d:
        d.cover(
            kicker="Protection",
            title=("Approved Claims", "& Messaging Guide"),
            standfirst=("A quick check before every creator post. When in doubt, ask before "
                        "you publish — not after."),
            tagline=("Say what is", "true."),
            meta=("Operational messaging guidance for creators. This is not legal advice, and "
                  "it does not replace the Creator Program Terms."),
        )

        d.section("01", "The standard", intro=(
            "Trust is built one accurate post at a time. Use only claims supported by your "
            "actual experience and current product information. Feature availability can "
            "change; when you are unsure, ask the UNIUI team before publishing."
        ))

        d.cards(
            [
                ("Approved", "When accurate",
                 "“UniUI helps me study smarter.” · “UniUI can answer academic questions with "
                 "sources.” · “I use UNIUI for my coursework.” · “UniUI is built for Nigerian "
                 "students.”"),
                ("Check first", "Only if verified",
                 "“It's free to try” — only if the current offer is confirmed. · A feature "
                 "being live, available to all users, or working in a specific way. · A "
                 "result, saving or outcome that happened to you personally."),
                ("Avoid", "No guaranteed outcomes",
                 "Do not say UNIUI guarantees better grades, passes or academic success."),
                ("Avoid", "No assignment replacement",
                 "Do not say UNIUI does assignments for students, or should be submitted as "
                 "their work."),
                ("Avoid", "No perfection claims",
                 "Do not say UNIUI is 100% accurate or never makes mistakes."),
                ("Avoid", "No unsupported comparisons",
                 "Do not make claims about competitors, or imply university endorsement "
                 "without approval."),
            ],
            cols=2,
        )

        d.callout(
            "Why the cap on claims matters to you",
            "Claims are reviewed when a complaint is made, not before a post goes up. A post "
            "promising grades exposes UNIUI to a consumer-protection claim, and your "
            "commission on every active creator is paused while it is investigated. Accurate "
            "posting protects your earnings as well as the brand.",
            kind="warn",
        )

        d.section("02", "Disclosure", intro=(
            "Make your creator relationship visible. Concealed advertising is the fastest way "
            "to lose both your audience's trust and your standing in the program."
        ))
        d.cards(
            [
                ("Every post", "Required disclosure",
                 "Every post must include “I'm a UNIUI creator” or #UniUICreator. Place it "
                 "where a viewer can notice it; do not hide it among unrelated tags."),
                ("Campaign", "Tag the brand",
                 "Tag @UniUI where the platform supports it and the campaign asks for a tag. "
                 "Use #UniUICreator where appropriate."),
            ],
            cols=2,
        )

        d.section("03", "Safer alternatives", intro=(
            "Almost every risky claim has an honest version that performs just as well. The "
            "honest one is more persuasive, because your audience can tell the difference."
        ))
        d.cards(
            [
                ("Accuracy", "Instead of “It never gets anything wrong”",
                 "Try: “I checked this answer against the source it showed. Here is what I "
                 "found.”"),
                ("Outcomes", "Instead of “It will get you an A”",
                 "Try: “I used it to review this topic. I still checked my notes and course "
                 "guidance.”"),
                ("Integrity", "Instead of “It does my assignment”",
                 "Try: “I used it to understand a concept; the submitted work and final answer "
                 "are mine.”"),
                ("Availability", "Instead of “This feature is available to everyone”",
                 "Try: “This is what I could access in my account today.”"),
                ("Speed", "Instead of “It learns any course instantly”",
                 "Try: “I uploaded my lecture notes and asked about a topic from that class.”"),
                ("Comparison", "Instead of “It's better than [competitor]”",
                 "Try: describe what it did for you, and let the viewer compare."),
            ],
            cols=2,
        )

        d.section("04", "Quick review", intro="A 30-second pre-post check. Run it every time.")
        d.checklist([
            ("Six checks before publishing", [
                "I tried it — I am describing a real experience, not a copied or imagined testimonial.",
                "I checked it — any source, answer or feature claim matches what I actually saw.",
                "I disclosed — “I'm a UNIUI creator” or #UniUICreator appears clearly.",
                "I protected privacy — no personal data, private student details or confidential "
                "assessment content is visible.",
                "I stayed in bounds — no guaranteed grades, perfect accuracy, assignment "
                "replacement or competitor claims.",
                "I asked when unsure — the UNIUI team has reviewed uncertain release details "
                "or wording.",
            ]),
        ])

        d.callout(
            "If you are unsure, do not guess",
            "Ask in the creator group before the post goes live. A question costs you an hour. "
            "A retracted post costs you the commission on that campaign.",
        )

        d.section("05", "Phrases to retire", intro=(
            "These read as claims a regulator or an angry comment would quote. Replace them with "
            "the approved wording earlier in this guide."
        ))
        d.table(
            ["Do not say", "Say instead"],
            [
                ["“UniUI guarantees an A”",
                 "“I use it to review topics faster, then I check my course materials.”"],
                ["“It does your assignment”",
                 "“It helps me understand concepts; my submitted work is mine.”"],
                ["“It never gets anything wrong”",
                 "“I check the answer against the source it shows.”"],
                ["“It's free”",
                 "“This is what I could access in my account today.”"],
                ["“UniUI is endorsed by [school]”",
                 "“It's built for Nigerian university students.”"],
                ["“Better than [competitor]”",
                 "Describe what it did for you and let the viewer compare."],
                ["“Everyone in my course uses it”",
                 "“Several people in my class have tried it.”"],
                ["“It learns any course instantly”",
                 "“I uploaded my notes and asked about a topic from that class.”"],
            ],
            widths=[CONTENT_W * 0.42, CONTENT_W * 0.58],
        )

        d.section("06", "Organic versus paid posts", intro=(
            "Once a campaign is live, some creators will be offered paid placement. The "
            "disclosure rules do not change."
        ))
        d.cards(
            [
                ("Paid", "It must still be disclosed",
                 "A paid creator post needs the same “I'm a UNIUI creator” or #UniUICreator "
                 "disclosure, plus whatever the platform requires for advertising."),
                ("Paid", "The claims rules are identical",
                 "Being paid makes a false claim more dangerous, not less. The Approved Claims "
                 "guide applies without exception."),
                ("Paid", "Separate the two relationships",
                 "If a post is both a creator post and a paid placement, say so plainly rather "
                 "than blurring them."),
            ],
            cols=3,
        )

        d.text(
            "This guide is operational messaging guidance for creators; it is not legal advice.",
            size=8.5,
            color=INK_FAINT,
        )


# ===========================================================================
# DOC 08 — Creator Program Terms
# ===========================================================================


def doc_terms() -> None:
    with Doc(
        OUT / "08_creator_program_terms.pdf",
        doc_id="DOC 08",
        title="Creator Program Terms",
        eyebrow="Protection · Program Terms",
    ) as d:
        d.cover(
            kicker="Protection",
            title=("Creator Program", "Terms"),
            standfirst=("Clear rules and fair tracking. Read this before you post your first "
                        "campaign, not after your first question."),
            tagline=("Clear rules.", "Fair tracking."),
            meta=("Plain-language program summary based on the confirmed Creator Program "
                  "rules. Uni UI should confirm final operating details and any legally "
                  "required terms before enrollment or payout."),
        )

        d.section("01", "Attribution and tracking", intro=(
            "Every approved creator receives a unique referral link. Commission is calculated "
            "from that link, so the tracking rules below decide who gets paid."
        ))
        d.cards(
            [
                ("Tracking", "Your unique link",
                 "Each approved creator receives a unique referral link for tracking eligible "
                 "referrals."),
                ("Credit", "Last click wins",
                 "If a user clicks more than one creator link, the last click is credited."),
                ("Window", "30-day window",
                 "A referral is attributed within 30 days of first click. Ask the team how the "
                 "window interacts with later clicks before launch."),
                ("Exclusion", "No self-referrals",
                 "You cannot earn commission by referring yourself. Self-referral is detected "
                 "automatically and results in immediate suspension."),
            ],
            cols=2,
        )

        d.section("02", "Earnings", intro=(
            "Commission is a percentage of what a subscriber pays, scaled to the number of "
            "paying subscribers you have brought. It is not a flat fee per signup."
        ))

        rows = []
        for label, rng, sf, sr, st, ft in tier_rows():
            rows.append([
                label, rng,
                f"{money(sf)}", f"{money(sr)}", money(st), money(ft),
            ])
        d.text(
            f"Per paying subscriber on the {naira(SCHOLAR_PRICE)} Scholar subscription. The "
            f"last column applies to founding creators — the first {20} approved, who carry a "
            f"permanent +{FOUNDING_BONUS_PCT}% on every rate.",
        )
        d.table(
            ["Tier", "Subscribers", "First payment", f"Monthly ×{RECURRING_MONTHS}", "Total", "Founding total"],
            rows,
            widths=[CONTENT_W * 0.15, CONTENT_W * 0.13, CONTENT_W * 0.16,
                    CONTENT_W * 0.17, CONTENT_W * 0.19, CONTENT_W * 0.20],
            align_right=[2, 3, 4, 5],
            highlight={0},
        )

        d.callout(
            "Tier progression",
            "Your tier is based on your total number of paying subscribers and applies to all "
            "of them — not just the newest. Crossing 10 lifts the rate on your entire book of "
            "business, which is deliberate: it rewards the creators who keep bringing students "
            "rather than the ones who spike once.",
        )

        d.subhead("One-time products")
        d.text(
            f"{naira(DEEP_STUDY_PRICE)} Deep Study is a one-time purchase and earns no "
            f"recurring commission. Its commission is capped at {money(DEEP_STUDY_CAP)} per "
            "purchase, so a single sale can never exceed that amount regardless of your tier."
        )

        d.subhead("Recruiting other creators")
        d.text(
            f"If you refer another creator and they are both approved and activated, you "
            f"receive a one-time bonus of {money(RECRUIT_BONUS)}. This is a flat one-time "
            "payment. There is no downline, no override, and no ongoing commission from "
            "creators you recruit. The moment it compounds, it would be a multi-level scheme, "
            "which this program is not."
        )

        d.section("03", "Payout mechanics")
        d.cards(
            [
                ("Payment", "Weekly via Paystack",
                 "Approved commissions are scheduled for weekly payment through Paystack, "
                 "subject to payout eligibility and processing."),
                ("Threshold", f"{naira(PAYOUT_MIN)} minimum",
                 f"Balances below {naira(PAYOUT_MIN)} carry forward to the next batch. They "
                 "are not forfeited."),
                ("Hold", "7-day hold",
                 "Commission is held for seven days after the subscriber's payment to allow "
                 "for refunds. Refunded payments do not qualify."),
                ("Approval", "Batch approval",
                 "A SuperAdmin approves each payout batch before the transfer executes."),
                ("Verification", "Bank account verified",
                 "Bank details are collected at payout onboarding, not at application, and "
                 "verified through Paystack account resolution."),
                ("Ledger", "Every entry marked paid",
                 "Each ledger entry is marked paid after the transfer completes, so your "
                 "dashboard and the team agree."),
            ],
            cols=3,
        )

        d.section("04", "Fraud rules", intro=(
            "The governing principle: a single bad referral is one bad user, not one bad "
            "creator. Blocking on the first failure turns the fraud system into a weapon."
        ))
        d.cards(
            [
                ("Trigger", "1 referral fails",
                 "Void that referral. No block, no warning count."),
                ("Trigger", "1 referral fails a third check",
                 "Hold the commission for that referral. No block."),
                ("Trigger", "5+ failures in 30 days",
                 "Flag the creator for manual review."),
                ("Trigger", "30%+ failure rate over 20+ referrals",
                 "Suspend pending review."),
                ("Trigger", "Self-referral detected",
                 "Immediate suspension."),
                ("Trigger", "Click farming",
                 "Investigate — for example 100 clicks and 0 signups."),
            ],
            cols=3,
        )

        d.section("05", "What does not count", intro=(
            "The following activity is not eligible for commission, regardless of how it was "
            "generated."
        ))
        d.cards(
            [
                ("Ineligible", "Fake accounts", "Accounts created to inflate signup or referral numbers."),
                ("Ineligible", "Duplicate registrations", "Repeated registrations by the same person or duplicate records."),
                ("Ineligible", "Self-referrals", "A creator referring their own account or payment."),
                ("Ineligible", "Refunded payments", "A payment that is refunded is excluded from eligible commission."),
                ("Ineligible", "Fraudulent activity", "Manipulation, deception or other fraudulent referral activity."),
                ("Ineligible", "Cancelled subscriptions", "Subscriptions cancelled within 7 days do not qualify."),
            ],
            cols=2,
        )

        d.section("06", "Status tiers", intro=(
            "Status tiers measure activity and standing. They are separate from commission "
            "tiers, which measure subscribers brought — a creator can be Top status on Starter "
            "commission."
        ))
        d.cards(
            [
                ("Tier", "🌱 Creator",
                 "Newly approved. Group access and resources. This is where every creator starts."),
                ("Tier", "⚡ Active",
                 "Posted 2× per week for 4 consecutive weeks. Early access and priority on campaigns."),
                ("Tier", "🔥 Top",
                 "10+ subscribers plus consistent posting. Exclusive campaigns and recognition."),
                ("Tier", "👑 Elite",
                 "50+ subscribers plus long-term standing. Direct team access and custom "
                 "arrangements."),
            ],
            cols=4,
        )

        d.section("07", "Conduct and leaving")
        d.cards(
            [
                ("Conduct", "No false claims",
                 "Follow the Approved Claims & Messaging Guide. Do not make promises about "
                 "grades, perfect accuracy or assignment completion."),
                ("Conduct", "No spam or fake engagement",
                 "Do not spam audiences or manipulate likes, views, comments or referrals."),
                ("Disclosure", "Disclose your relationship",
                 "Make your UNIUI creator relationship clear on every post using “I'm a UNIUI "
                 "creator” or #UniUICreator."),
                ("Removal", "Removal for misconduct",
                 "UNIUI may remove participants for fraud or misconduct. A review and appeal "
                 "process applies where one is published."),
                ("Exit", "Leave any time",
                 "You may leave the program at any time. Pending commissions are paid if you "
                 "leave in good standing, subject to verification and the payout threshold."),
            ],
            cols=2,
        )

        d.callout(
            "Questions or a tracking issue?",
            "Raise it in the UNIUI creator WhatsApp group. Keep your referral links, post URLs "
            "and relevant dates so the team can investigate quickly.",
        )

        d.section("08", "Acknowledgment")
        d.text(
            "I have read this plain-language summary and understand that final program rules, "
            "eligibility and payout decisions are subject to the confirmed UNIUI Creator "
            "Program terms."
        )
        d.worksheet([
            ("Signature", ["Name", "Date", "Signature (if required)"]),
        ])
        d.text(
            "Source: confirmed Creator Program rules. Final legal and operational review is "
            "recommended before circulation.",
            size=8.5,
            color=INK_FAINT,
        )


# ===========================================================================


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    builders = [
        ("02_creator_program_overview.pdf", doc_overview),
        ("04_week1_onboarding_pack.pdf", doc_week1),
        ("05_week2_product_demonstration_guide.pdf", doc_week2),
        ("06_week3_content_playbook_campaign_briefs.pdf", doc_week3),
        ("07_approved_claims_messaging_guide.pdf", doc_claims),
        ("08_creator_program_terms.pdf", doc_terms),
    ]
    for name, fn in builders:
        fn()
        path = OUT / name
        print(f"  {name:52} {path.stat().st_size/1024:6.0f} KB")

    print(f"\nFace: {'DejaVu (real naira glyph)' if F.has_naira else 'Helvetica (NGN fallback)'}")
    print(f"Written to {OUT.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
