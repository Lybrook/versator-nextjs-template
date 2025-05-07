export const SEO_CONFIG = {
  description:
    "Versator template serves as the foundation for your ecommerce platform, helping you create efficient, engaging, and profitable online stores. Versator enhances any ecommerce with the power of modern tech stack.",
  fullName: "Versator Next.js Template",
  name: "Versator",
  slogan: "Store which makes you happy.",
};

export const SYSTEM_CONFIG = {
  redirectAfterSignIn: "/dashboard/profile",
  redirectAfterSignUp: "/dashboard/profile",
  repoName: "versator",
  repoOwner: "blefnk",
  repoStars: true,
};

export const ADMIN_CONFIG = {
  displayEmails: false,
};

export const DB_DEV_LOGGER = false;

/**
 * flag to enable/disable svix webhook signature verification.
 * remember to fill in the svix secret in the .env file.
 *
 * if disabled:
 * - stripe: stripe webhooks will use native verification.
 * - clerk: sync between clerk and db will be disabled.
 */
export const SVIX_ENABLED = false;

/**
 * totp-based multi-factor authentication
 *
 * to enable it:
 * 1. set mfa_enabled to true
 * 2. enable mfa in the clerk dashboard:
 * https://dashboard.clerk.com/last-active?path=user-authentication/multi-factor
 *
 * Learn more:
 * @see https://clerk.com/docs/authentication/configuration/force-mfa
 * @see https://clerk.com/docs/custom-flows/manage-totp-based-mfa
 */
export const MFA_ENABLED = false;
