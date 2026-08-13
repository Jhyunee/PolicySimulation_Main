# Policy Pathway User Study

Standalone deployment for the CHI policy-pathway user study. The bundled policy artifacts currently enable the Welfare and Climate domain variants.

## Railway variables

- `DEEPSEEK_API_KEY`: required for stakeholder chat.
- `ADMIN_TOKEN`: required to view `study_admin.html` and `study_results.html` data.
- `PROLIFIC_COMPLETION_URL`: the complete-submission redirect URL supplied by Prolific.
- `DATA_DIR=/data`: optional when a Railway Volume is mounted at `/data`; the app automatically uses Railway's mount-path variable when present.

Attach a Railway Volume at `/data` before collecting responses. Do not commit the SQLite database.
The service listens on internal port `8000`; set the Railway domain target port to `8000`.
The root domain opens the administrator variant manager. Participant-facing links must include a fixed `variant` query parameter.

## Prolific URL pattern

Use one Prolific study per fixed policy pair, condition, and order:

`https://YOUR_DOMAIN/study.html?variant=welfare--framework--ab&PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}`

The server rejects missing or incomplete variants, so a participant cannot receive a random policy pair.
