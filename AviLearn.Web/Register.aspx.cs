using System;
using System.Configuration;
using System.Data.SqlClient;
using System.Web.Security;

namespace AviLearn.Web
{
    public partial class Register : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (User.Identity.IsAuthenticated)
            {
                if (Session["UserId"] == null)
                {
                    FormsAuthentication.SignOut();
                }
                else
                {
                    Response.Redirect("~/Dashboard.aspx");
                }
            }
        }

        protected void btnRegister_Click(object sender, EventArgs e)
        {
            if (Page.IsValid)
            {
                string name = txtName.Text.Trim();
                string email = txtEmail.Text.Trim();
                string password = txtPassword.Text; // In production, HASH this
                string newId = "usr_" + Guid.NewGuid().ToString().Substring(0, 8);

                string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
                
                try
                {
                    using (SqlConnection conn = new SqlConnection(connString))
                    {
                        conn.Open();
                        
                        // Check if email exists
                        string checkQuery = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
                        using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                        {
                            checkCmd.Parameters.AddWithValue("@Email", email);
                            int count = Convert.ToInt32(checkCmd.ExecuteScalar());
                            if (count > 0)
                            {
                                lblMessage.Text = "An account with this email already exists.";
                                lblMessage.Visible = true;
                                return;
                            }
                        }

                        // Insert new user
                        string insertQuery = "INSERT INTO Users (Id, Name, Email, PasswordHash, Role, XP) VALUES (@Id, @Name, @Email, @Password, 'member', 0)";
                        using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                        {
                            cmd.Parameters.AddWithValue("@Id", newId);
                            cmd.Parameters.AddWithValue("@Name", name);
                            cmd.Parameters.AddWithValue("@Email", email);
                            cmd.Parameters.AddWithValue("@Password", password); // Should be hashed
                            
                            cmd.ExecuteNonQuery();
                        }
                    }

                    // Auto-login after registration
                    Session["UserId"] = newId;
                    Session["UserName"] = name;
                    Session["UserRole"] = "member";
                    
                    FormsAuthentication.SetAuthCookie(newId, false);
                    Response.Redirect("~/Dashboard.aspx");
                }
                catch (Exception ex)
                {
                    lblMessage.Text = "Database error. Please ensure the MySQL database is running and configured in Web.config. " + ex.Message;
                    lblMessage.Visible = true;
                }
            }
        }
    }
}
