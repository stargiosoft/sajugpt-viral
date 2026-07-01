## Chapter 1. Purpose & Scope

### Purpose

WORKFLOW.md defines how Agents work together to complete a task. It is the official Single Source of Truth for cross-Agent execution order and handoff across the entire ST AI Team.

Every Agent — including Project Architect, Implementer, Code Reviewer, and QA — follows this document for how work moves between them. No Agent describes its own inter-agent workflow; each Agent document defines only its own internal procedure and refers here for sequencing.

### Scope

**Included**

- The order in which Agents execute for a given type of task
- Handoff rules between Agents
- Rules for when Agents may work in parallel
- Conditions under which a workflow is considered complete

**Excluded**

- Product or engineering philosophy — see PLAYBOOK.md
- Quality standards and decision criteria — see PLAYBOOK.md
- Individual Agent responsibilities, scope, and decision authority — see the relevant Agent document
- How an Agent performs its own work internally — see the relevant Agent document

### Single Source of Truth

Each type of content has exactly one authoritative location:

- Workflow and execution sequence → WORKFLOW.md
- Engineering philosophy and principles → PLAYBOOK.md
- Agent responsibilities, scope, and internal procedure → the relevant Agent document

No document may redefine, duplicate, or override content owned by another document.

Every document must reference the Single Source of Truth instead of repeating it.

---

## Chapter 2. Workflow Principles

These principles govern how every workflow operates. They do not define execution order (see Chapter 3, Standard Task Sequences) or Agent responsibilities (see the relevant Agent document).

### Sequential by Default

All workflows proceed sequentially by default. Parallel execution is permitted only when explicitly authorized.

### Single Ownership

Every task always has exactly one Owner Agent. Other Agents may collaborate, but never hold the same responsibility at the same time.

### Single Source of Truth

Workflow follows WORKFLOW.md.

No Agent may redefine, duplicate, or override workflow behavior defined in this document.

When workflow guidance is needed, every Agent must reference WORKFLOW.md rather than restating it.

### Explicit Handoff

Every task is transferred to the next Agent through an explicit handoff. Implicit completion does not exist.

### No Skipping

Required workflow steps cannot be skipped arbitrarily. Permitted exceptions are defined only in Chapter 6, Exception Handling.

### Escalation First

When uncertainty arises during a workflow, the Agent escalates instead of guessing.

### Quality Before Speed

Quality takes precedence over speed. Correct completion takes precedence over fast completion.

### Ready for Next Agent

An Agent's task does not end when its own work is finished. It ends when the next Agent can begin immediately.

### Workflow Principle

A workflow is complete only when each Agent completes its own responsibility and successfully hands off work to the next Agent.

---

## Chapter 3. Standard Task Sequences

### New Feature

Purpose
Deliver new functionality from an approved plan through to production.

Sequence
Project Architect
↓
Implementer
↓
Code Reviewer
↓
QA
↓
Deployment

Completion
The workflow is complete when Deployment finishes successfully.

### Bug Fix

Purpose
Correct a defect in existing functionality.

Sequence
Project Architect
↓
Implementer
↓
Code Reviewer
↓
QA

Completion
The workflow is complete when QA verifies the fix.

### UI Improvement

Purpose
Improve the visual implementation of an existing interface.

Sequence
Project Architect
↓
UI Reviewer
↓
Implementer
↓
Code Reviewer
↓
QA

Completion
The workflow is complete when QA verifies the change.

### UX Improvement

Purpose
Improve usability or interaction flow.

Sequence
Project Architect
↓
UX Reviewer
↓
Implementer
↓
Code Reviewer
↓
QA

Completion
The workflow is complete when QA verifies the change.

### Refactoring

Purpose
Improve code structure without changing external behavior.

Sequence
Project Architect
↓
Implementer
↓
Code Reviewer

Completion
The workflow is complete when Code Reviewer approves the refactor.

### Documentation Update

Purpose
Update or create documentation.

Sequence
Project Architect
↓
Documentation

Completion
The workflow is complete when Documentation finalizes the update.

### Design System Update

Purpose
Update shared design tokens, components, or standards.

Sequence
Project Architect
↓
Design System Manager
↓
Implementer
↓
Code Reviewer

Completion
The workflow is complete when Code Reviewer approves the change.

---

## Chapter 4. Handoff Rules

### Handoff Requirements

Every handoff must include the following information:

- Summary
- Deliverables
- Known Risks
- Open Questions
- Ready For

### Ownership Transfer

Once a handoff is complete, the next Agent becomes the Owner of the work.

The previous Agent may provide clarification when needed, but is no longer the Owner.

### No Silent Handoff

Work is never handed off without explanation.

### No Incomplete Handoff

Work whose Checklist has not been completed cannot be handed off.

### Traceability

Every handoff must be traceable — who handed off what, and when.

### Handoff Acceptance

A handoff is considered accepted when the receiving Agent has all required information to begin work without requesting missing context.

If required information is missing, the receiving Agent must request clarification before accepting ownership.

### Handoff Principle

A handoff is complete only when the next Agent has everything required to continue without unnecessary investigation.

---

## Chapter 5. Parallel Execution

Parallel execution is the explicit exception to the Sequential by Default principle (Chapter 2). This chapter defines when it is allowed and how it is managed.

### When Parallel Execution Is Allowed

Parallel execution is allowed only when two or more Agents review or evaluate the same deliverable independently, without modifying it.

### Independent Review

UI Reviewer and UX Reviewer may review the same implementation in parallel, since each owns a distinct domain and neither modifies the other's output.

### Prohibited Parallel Combinations

Agents that would modify the same deliverable, or that share ownership of the same decision, may never work in parallel. This preserves the Single Ownership principle (Chapter 2).

### Reconciliation

When parallel outputs conflict, the Project Architect resolves the conflict. Agents do not resolve ownership conflicts among themselves.

### Parallel Execution Principle

Parallel execution may shorten a workflow's duration, but it never changes who owns the resulting decision.

---

## Chapter 6. Exception Handling

This chapter defines how a workflow deviates from a Standard Task Sequence (Chapter 3) when a standard sequence does not fit the situation.

### When Exceptions Apply

An exception applies when a task does not match any Standard Task Sequence, or when a required Agent is unavailable or not applicable to the task.

### Exception Approval

Only the Project Architect may approve a deviation from a Standard Task Sequence. No Agent may skip a step on its own authority.

### Skipping a Step

A step may be skipped only when the Project Architect confirms it is not applicable to the task, and the reason is recorded in the handoff.

### Minor Edit Fast-Track

A task qualifies as a Minor Edit when all of the following are true:

- No architecture, data structure, or API contract change
- No new file, component, or dependency introduced
- Change is confined to a single file or a small, clearly bounded set of files
- Risk of regression is low and easily verified by inspection

For a Minor Edit, the Project Architect may approve a shortened sequence — typically Project Architect → Implementer, or Project Architect → Implementer → QA — skipping steps that would otherwise apply under the Standard Task Sequence.

The Project Architect still makes this call explicitly; it is not the Implementer's decision to shorten the sequence on its own (per Chapter 2, No Skipping).

The shortened sequence is recorded in the handoff, same as any other exception (per the Exception Handling Principle).

### Reordering Steps

Steps may be reordered only when the Project Architect determines the change does not compromise Single Ownership or Quality Before Speed (Chapter 2).

### Escalation Path

If an Agent encounters a situation not covered by this chapter, the Agent escalates to the Project Architect rather than deciding independently.

### Exception Handling Principle

An exception is valid only when it is explicitly approved and recorded — never assumed.

---

## Chapter 7. Workflow Diagrams

This chapter provides a visual quick reference to the Standard Task Sequences defined in Chapter 3. It introduces no new rules.

### New Feature
Project Architect
↓
Implementer
↓
Code Reviewer
↓
QA
↓
Deployment

### Bug Fix
Project Architect
↓
Implementer
↓
Code Reviewer
↓
QA

### UI Improvement
Project Architect
↓
UI Reviewer
↓
Implementer
↓
Code Reviewer
↓
QA

### UX Improvement
Project Architect
↓
UX Reviewer
↓
Implementer
↓
Code Reviewer
↓
QA

### Refactoring
Project Architect
↓
Implementer
↓
Code Reviewer

### Documentation Update
Project Architect
↓
Documentation

### Design System Update
Project Architect
↓
Design System Manager
↓
Implementer
↓
Code Reviewer
