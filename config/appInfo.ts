export const appInfo = {
  // learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
  appName: "Jesus Shirt Project",
  apiDomain: `${process.env.NEXT_PUBLIC_CLIENT_API_URL}`,
  websiteDomain: `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`,
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
};
console.log(process.env.NEXT_PUBLIC_WEBSITE_DOMAIN)
