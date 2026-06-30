# Firestore Security Specification

This document details the security constraints, relational data invariants, and adversarial test scenarios (the "Dirty Dozen") designed to validate the robust Zero-Trust security rules governing Promptary.

## Data Invariants
1. **Authenticated Authorship**: A prompt document can only be created if the caller is authenticated.
2. **True Identity Constraint**: The `userId` of the created prompt must strictly match the authenticated user's Firebase UID (`request.auth.uid`).
3. **Author Matching**: The prompt `author.name` should match a valid author name, and `userId` must be the authenticated user's UID.
4. **Verified Users**: All publish actions are restricted to users whose emails are verified (if verification is enabled or using general standard `request.auth.uid != null` with `email_verified == true`).
5. **Timestamp Honesty**: The `createdAt` property must exactly equal the server-generated `request.time`.
6. **Immutability of Key Identifiers**: Key identifiers such as `id`, `userId`, `createdAt`, and `forkedFrom` cannot be modified under any circumstances after creation.
7. **Size & Type Safety**: Strings must have tight maximum length checks (e.g., title <= 150 characters, description <= 500 characters, prompt <= 10000 characters) to prevent "Denial of Wallet" resource consumption.
8. **No Guest Writes**: Unauthenticated callers are completely blocked from writing, updating, or deleting any document.

---

## The "Dirty Dozen" Payloads
The following payloads are explicitly designed to bypass system protections and MUST be rejected with `PERMISSION_DENIED` by our Firestore rules.

1. **Unauthenticated Write (Pillar 1)**
   - **Payload**: Attempt to create a prompt with id `p_fake_1` as an unauthenticated user.
   - **Target Action**: `create` on `/prompts/p_fake_1`
   - **Expected Result**: `PERMISSION_DENIED`

2. **Identity Spoofing (Pillar 2)**
   - **Payload**: User `alice_123` attempts to publish a prompt where `userId` is set to `bob_999` to impersonate another user.
   - **Target Action**: `create` on `/prompts/p_fake_2`
   - **Expected Result**: `PERMISSION_DENIED`

3. **Email Spoofing / Unverified User (Pillar 5)**
   - **Payload**: User has `email_verified` as `false` in their Firebase Auth token, but tries to write to the database.
   - **Target Action**: `create` on `/prompts/p_fake_3`
   - **Expected Result**: `PERMISSION_DENIED`

4. **Shadow / Ghost Field Injection (Pillar 2)**
   - **Payload**: Injects an unrequested parameter `isAdmin: true` or `isSystemApproved: true` into the prompt document.
   - **Target Action**: `create` on `/prompts/p_fake_4`
   - **Expected Result**: `PERMISSION_DENIED`

5. **Future Timestamp / Client-Spoofed Date (Pillar 13)**
   - **Payload**: Setting `createdAt` to a client-generated date (e.g., 10 days in the future or past) instead of `request.time`.
   - **Target Action**: `create` on `/prompts/p_fake_5`
   - **Expected Result**: `PERMISSION_DENIED`

6. **Title Boundary Size Violation (Pillar 3)**
   - **Payload**: Setting a prompt `title` to a 50KB junk string.
   - **Target Action**: `create` on `/prompts/p_fake_6`
   - **Expected Result**: `PERMISSION_DENIED`

7. **Prompt Body Size Exhaustion (Pillar 3)**
   - **Payload**: Setting a `prompt` content body to a 2MB string.
   - **Target Action**: `create` on `/prompts/p_fake_7`
   - **Expected Result**: `PERMISSION_DENIED`

8. **Tampering with Immortal Fields (Pillar 12)**
   - **Payload**: A logged-in user attempts to update the `createdAt` timestamp of their own previously published prompt.
   - **Target Action**: `update` on `/prompts/p_user_1` with changed `createdAt`.
   - **Expected Result**: `PERMISSION_DENIED`

9. **Hijacking Someone Else's Prompt (Pillar 4)**
   - **Payload**: User `eve_555` attempts to update/edit a prompt belonging to `alice_123`.
   - **Target Action**: `update` on `/prompts/p_alice_1`
   - **Expected Result**: `PERMISSION_DENIED`

10. **Malicious ID Injection / Poisoning (Pillar 3)**
    - **Payload**: Document ID is constructed using hazardous path traversal characters like `../../hack_db`.
    - **Target Action**: `create` on `/prompts/..%2F..%2Fhack_db`
    - **Expected Result**: `PERMISSION_DENIED`

11. **Malicious Array Bloating (Pillar 5)**
    - **Payload**: Creating or updating a prompt with an array of `tags` containing 5,000 strings.
    - **Target Action**: `create` or `update` on `/prompts/p_fake_11`
    - **Expected Result**: `PERMISSION_DENIED`

12. **Self-Promotion Usage Count Manipulation (Pillar 4)**
    - **Payload**: Attempting to update a prompt's `usageCount` directly to `1000000` from the client.
    - **Target Action**: `update` on `/prompts/p_user_1`
    - **Expected Result**: `PERMISSION_DENIED`
