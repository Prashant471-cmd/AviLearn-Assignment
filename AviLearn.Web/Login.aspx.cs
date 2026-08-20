using System;
using System.Data;
using System.Web.Security;
using System.Data.SqlClient;
using System.Configuration;

namespace AviLearn.Web
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (User.Identity.IsAuthenticated)
            {
                if (Session["UserId"] == null)
                {
                    // Session expired but Auth cookie is still present. 
                    // Clear the stale auth cookie to prevent infinite redirect loops.
                    FormsAuthentication.SignOut();
                }
                else
                {
                    Response.Redirect("~/Dashboard.aspx");
                }
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            if (Page.IsValid)
            {
                string email = txtEmail.Text.Trim();
                string password = txtPassword.Text; // In a real app, hash this and compare

                // Fallback demo accounts for immediate testing without DB
                if (email == "admin@avilearn.com" && password == "Admin123!")
                {
                    AuthenticateUser("usr_admin_1", "Admin User", "admin");
                    return;
                }
                if (email == "member@avilearn.com" && password == "Member123!")
                {
                    AuthenticateUser("usr_member_1", "Demo Member", "member");
                    return;
                }

                // Database check
                string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
                try
                {
                    using (SqlConnection conn = new SqlConnection(connString))
                    {
                        conn.Open();
                        string query = "SELECT Id, Name, Role FROM Users WHERE Email = @Email AND PasswordHash = @Password";
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.Parameters.AddWithValue("@Email", email);
                            cmd.Parameters.AddWithValue("@Password", password); // Should compare hash

                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                if (reader.Read())
                                {
                                    string id = reader["Id"].ToString();
                                    string name = reader["Name"].ToString();
                                    string role = reader["Role"].ToString();
                                    
                                    AuthenticateUser(id, name, role);
                                    return;
                                }
                            }
                        }
                    }
                    
                    lblError.Text = "Invalid email or password.";
                    lblError.Visible = true;
                }
                catch (Exception ex)
                {
                    // Fallback if DB not configured yet, just show error
                    lblError.Text = "Database connection error. Try using the demo accounts if DB is not setup. " + ex.Message;
                    lblError.Visible = true;
                }
            }
        }

        private void AuthenticateUser(string id, string name, string role)
        {
            Session["UserId"] = id;
            Session["UserName"] = name;
            Session["UserRole"] = role;

            FormsAuthentication.SetAuthCookie(id, false);

            if (role == "admin")
                Response.Redirect("~/Admin/Default.aspx");
            else
                Response.Redirect("~/Dashboard.aspx");
        }
    }
}
