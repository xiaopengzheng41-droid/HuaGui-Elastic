# Post-launch measurement and inquiry operations

The website code supports privacy-aware GA4 measurement, first-touch UTM attribution, internal inquiry email alerts, and baseline abuse protection. External services remain disabled until their environment variables are configured.

## GA4

Set `GA4_MEASUREMENT_ID` to a valid GA4 web stream ID such as `G-XXXXXXXXXX` in Vercel Production and Preview environments.

- Google Analytics is not loaded before a visitor accepts the analytics prompt.
- The site sends only the allow-listed events `view_product`, `request_quote`, `click_whatsapp`, `click_email`, and `generate_lead`.
- Names, company names, email addresses, phone numbers, inquiry messages, and inquiry IDs are never added to analytics events.
- Ad storage, ad personalization, and Google Signals remain disabled.
- Visitors can reopen the consent choice from **Analytics preferences** in the footer.

Use UTM parameters on campaign links:

```text
https://www.huaguielastic.com/pt-br/products.html?utm_source=facebook&utm_medium=paid_social&utm_campaign=brazil_distributors&utm_content=factory_video
```

The inquiry record stores the first landing path, external referrer host, and the five standard UTM parameters. It intentionally does not store `gclid`, `fbclid`, or arbitrary referrer paths.

## New-inquiry email alerts

The inquiry is saved before an email alert is attempted. A mail-provider outage therefore does not lose or reject a valid inquiry.

Configure these Vercel secrets only after the sending domain and address have been verified in Resend:

- `RESEND_API_KEY`
- `INQUIRY_NOTIFICATION_TO`
- `INQUIRY_NOTIFICATION_FROM`

The notification uses an idempotency key derived from the inquiry ID and sets the buyer's address as `reply_to`. If any required variable is absent, notification is safely skipped and the inquiry remains available in `/admin`.

## Abuse and security controls

- Public contact requests require JSON, reject explicit cross-site browser submissions, retain the existing honeypot, and use a five-attempt / ten-minute per-instance burst limit.
- Admin login uses a five-attempt / fifteen-minute per-instance burst limit.
- The Vercel configuration adds CSP, frame denial, MIME sniffing protection, a strict referrer policy, and a restricted Permissions Policy.

The in-function rate limit is a burst control, not a global distributed limit. If sustained abuse appears, enable a durable Vercel WAF rule or a managed rate-limit store only after reviewing the provider's pricing and expected traffic.

## Verification after each deployment

1. Confirm public pages, localized pages, products, `/sitemap.xml`, and `/admin` still load.
2. Confirm no request to `googletagmanager.com` occurs before analytics acceptance.
3. Submit a controlled inquiry with a unique test company name; verify it appears in `/admin` with attribution data.
4. When Resend is configured, verify exactly one notification arrives and the reply action targets the buyer.
5. Remove or resolve the controlled test inquiry according to the normal admin workflow.
