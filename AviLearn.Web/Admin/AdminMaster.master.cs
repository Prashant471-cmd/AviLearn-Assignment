using System;

namespace AviLearn.Web.Admin
{
    public partial class AdminMaster : System.Web.UI.MasterPage
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Security check for entire admin area
            if (Session["UserRole"] == null || Session["UserRole"].ToString() != "admin")
            {
                Response.Redirect("~/Login.aspx");
            }
        }
    }
}
