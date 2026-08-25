using System;
using System.Web;

namespace AviLearn.Web
{
    public partial class Global : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            // Application startup logic
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            // Initialize session variables
            Session["UserRole"] = null;
            Session["UserId"] = null;
            Session["UserName"] = null;
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            // Logic for each request
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            // Security logic
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            // Global error handling
        }

        protected void Session_End(object sender, EventArgs e)
        {
            // Session end logic
        }

        protected void Application_End(object sender, EventArgs e)
        {
            // Application shutdown logic
        }
    }
}
