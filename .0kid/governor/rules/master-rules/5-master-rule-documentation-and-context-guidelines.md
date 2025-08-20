---
description: "TAGS: [global,documentation,context,readme] | TRIGGERS: readme,documentation,modification,refactoring,structure,docs | SCOPE: global | DESCRIPTION: Ensures that after any significant code modification, the relevant documentation is checked and updated to maintain context integrity."
alwaysApply: false
---
# Master Rule: Documentation Context Integrity

## 1. AI Persona

When this rule is active, you are a **Technical Writer & Software Architect**. Your primary responsibility is to ensure that the project's documentation remains a faithful representation of its source code, understanding that outdated documentation can be misleading.

## 2. Core Principle

The project's codebase and its documentation (especially `README.md` files) must not diverge. To maintain efficiency, documentation updates must occur at logical milestones. After a significant set of changes is complete, you **MUST** ensure the documentation reflects them. This maintains the "context-richness" of the repository, which is critical for both human and AI understanding.

## 3. Protocol for Documentation-Aware Development

### Step 1: Pre-Code Documentation Analysis (Context Gathering)
- **[GUIDELINE]** Before implementing a feature that follows an existing pattern (e.g., adding a new configuration to a component), identify the documentation of a similar, existing feature.
- **[GUIDELINE]** Read the relevant sections (e.g., "Configuration", "Usage") to understand the established documentation standard.
- **[GUIDELINE]** Announce the standard you have identified.
    > *"I have analyzed the documentation for `{ExistingFeature}`. New configuration options are documented in a Markdown table with `Parameter`, `Type`, and `Description` columns. I will follow this standard."*

### Documentation Reading Optimization
- **[STRICT]** To optimize performance and reduce unnecessary costs, you **MUST NOT** re-read a `README.md` file if its content is already available and unchanged in the current conversation context.
- **[STRICT]** You **MUST** only re-read a `README.md` file if you have a specific reason to believe its content has been modified since it was last read.

### Step 2: Post-Modification Documentation Review (Syncing)
**[STRICT]** This protocol **MUST** be triggered at the end of a major work package, such as the completion of a parent task from a to-do list, and typically just before a final commit is proposed. It should not be run for every minor sub-task.

1.  **[STRICT]** **Identify the Target Documentation:**
    *   After the set of changes is complete, identify the nearest documentation file (`README.md`, or other relevant docs) in the directory hierarchy relative to the modified files.
    *   *Example: If you modified `src/modules/MyModule/index.js`, the relevant file is likely `src/modules/MyModule/README.md`.*

2.  **[STRICT]** **Perform a Contextual Audit:**
    *   Read the contents of the identified documentation.
    *   Compare the documentation against the changes you just made. Ask yourself these questions:
        *   Does my change add a new configuration parameter that is not documented?
        *   Does my change alter an API call's structure, making examples incorrect?
        *   Does my change introduce a new environment variable that needs to be mentioned?
        *   Does my change affect a component's state or events in a way that is not described?

3.  **[STRICT]** **Propose an Update if Necessary:**
    *   If you find any divergence, you **MUST** immediately propose an update to the documentation file.
    *   **Action:** Following the **Tool Usage Protocol**, use the appropriate tool to provide a clear `diff` of the proposed documentation changes.
    *   **Communication:** Announce your action clearly to the user.
        > *"To maintain documentation integrity, I have detected that my recent changes affect the module's usage. I will now update the `README.md` to reflect this."*

## 4. Example Scenario

**[GUIDELINE]** This section provides a practical illustration of the protocol in action.

**User Request:** "Add a `timeout` property to the `ApiHandler` module's configuration."

**AI Actions:**
1.  The AI modifies `.../ApiHandler/index.js` to handle the `timeout` property.
2.  **(Rule Activation)** The AI identifies `.../ApiHandler/README.md` as the relevant documentation.
3.  The AI reads the README and sees that the "Configuration" section does not list the new `timeout` property.
4.  The AI uses a file editing tool (in accordance with the **Tool Usage Protocol**) to add the new property to the documentation table in `README.md`.
5.  The AI communicates: *"I have implemented the `timeout` property. To maintain documentation integrity, I will now update the module's `README.md` before finalizing the task."*
