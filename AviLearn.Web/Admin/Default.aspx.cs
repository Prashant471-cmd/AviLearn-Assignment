using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace AviLearn.Web.Admin
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadStats();
            }
        }

        private void LoadStats()
        {
            string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
            
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();

                    // Count Users
                    using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Users", conn))
                    {
                        litTotalUsers.Text = cmd.ExecuteScalar().ToString();
                    }

                    // Count Birds
                    using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM BirdSpecies", conn))
                    {
                        litTotalBirds.Text = cmd.ExecuteScalar().ToString();
                    }

                    // Count Quizzes Taken
                    using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM QuizResults", conn))
                    {
                        litTotalQuizzes.Text = cmd.ExecuteScalar().ToString();
                    }

                    // Recent Users (TOP 5 instead of LIMIT 5 in T-SQL)
                    using (SqlCommand cmd = new SqlCommand("SELECT TOP 5 Name, Email, Role, JoinDate FROM Users ORDER BY JoinDate DESC", conn))
                    {
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            DataTable dt = new DataTable();
                            da.Fill(dt);
                            gvRecentUsers.DataSource = dt;
                            gvRecentUsers.DataBind();
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Fallback demo data
                litTotalUsers.Text = "2";
                litTotalBirds.Text = "1";
                litTotalQuizzes.Text = "0";
                
                DataTable dt = new DataTable();
                dt.Columns.Add("Name");
                dt.Columns.Add("Email");
                dt.Columns.Add("Role");
                dt.Columns.Add("JoinDate");
                dt.Rows.Add("Admin User", "admin@avilearn.com", "admin", DateTime.Now.ToString("MMM dd, yyyy"));
                dt.Rows.Add("Demo Member", "member@avilearn.com", "member", DateTime.Now.ToString("MMM dd, yyyy"));
                gvRecentUsers.DataSource = dt;
                gvRecentUsers.DataBind();
            }
        }
    }
}
