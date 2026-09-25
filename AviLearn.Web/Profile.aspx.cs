using System;
using System.Data.SqlClient;
using System.Configuration;

namespace AviLearn.Web
{
    public partial class Profile : System.Web.UI.Page
    {
        string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserId"] == null)
            {
                Response.Redirect("Login.aspx");
                return;
            }

            if (!IsPostBack)
            {
                LoadUserProfile();
            }
        }

        private void LoadUserProfile()
        {
            string userId = Session["UserId"].ToString();

            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string query = "SELECT Name, Email, Role, XP, JoinDate FROM Users WHERE Id = @Id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", userId);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                string name = reader["Name"].ToString();
                                lblName.Text = name;
                                lblInitial.Text = name.Length > 0 ? name.Substring(0, 1).ToUpper() : "?";
                                lblEmail.Text = reader["Email"].ToString();
                                lblRole.Text = reader["Role"].ToString();
                                lblXP.Text = reader["XP"].ToString();
                                
                                DateTime joinDate = Convert.ToDateTime(reader["JoinDate"]);
                                lblJoinYear.Text = joinDate.ToString("yyyy");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Graceful degradation
                lblName.Text = "Error loading profile.";
                System.Diagnostics.Debug.WriteLine("Profile Load Error: " + ex.Message);
            }
        }
    }
}
