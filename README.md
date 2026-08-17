# Policy Pathway User Study

Standalone deployment for the CHI policy-pathway user study. The bundled policy artifacts currently enable the Welfare and Climate domain variants.

## Railway variables

- `DEEPSEEK_API_KEY`: required for stakeholder chat.
- `ADMIN_TOKEN`: required to view `study_admin.html` and `study_results.html` data.
- `PROLIFIC_COMPLETION_URL`: fallback complete-submission redirect URL supplied by Prolific.
- `PROLIFIC_COMPLETION_URL_<DOMAIN>`: domain-specific completion URL, such as `PROLIFIC_COMPLETION_URL_WELFARE`. Baseline, Framework, AB, and BA variants in the same domain share this URL.
- `PROLIFIC_SCREENED_OUT_URL`: fallback custom-screening redirect URL supplied by Prolific.
- `PROLIFIC_SCREENED_OUT_URL_<DOMAIN>`: domain-specific custom-screening URL, such as `PROLIFIC_SCREENED_OUT_URL_WELFARE`. Participants who select `None` for policy-related research or practice experience are redirected here after their background response is saved.
- `DATA_DIR=/data`: optional when a Railway Volume is mounted at `/data`; the app automatically uses Railway's mount-path variable when present.

Attach a Railway Volume at `/data` before collecting responses. Do not commit the SQLite database.
The service listens on internal port `8000`; set the Railway domain target port to `8000`.
The root domain opens the administrator variant manager. Participant-facing links must include a fixed `variant` query parameter.

## Prolific URL pattern

Use one Prolific study per fixed policy pair, condition, and order:

`https://YOUR_DOMAIN/study.html?variant=welfare--framework--ab&PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}`

The server rejects missing or incomplete variants, so a participant cannot receive a random policy pair.

Redirect variables are resolved by domain and then by the common fallback. For example, every Welfare participant uses `PROLIFIC_COMPLETION_URL_WELFARE` when available, regardless of condition or policy order, and otherwise uses `PROLIFIC_COMPLETION_URL`.
