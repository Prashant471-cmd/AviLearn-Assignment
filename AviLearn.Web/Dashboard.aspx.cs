using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace AviLearn.Web
{
    public partial class Dashboard : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserId"] == null)
            {
                Response.Redirect("~/Login.aspx");
                return;
            }

            if (!IsPostBack)
            {
                LoadDashboardData();
            }
        }

        private void LoadDashboardData()
        {
            string userId = Session["UserId"].ToString();
            string userName = Session["UserName"].ToString();
            litUserName.Text = userName.Split(' ')[0]; // First name

            string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
            
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();

                    // 1. Get User XP
                    string userQuery = "SELECT XP FROM Users WHERE Id = @UserId";
                    using (SqlCommand cmd = new SqlCommand(userQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        object xpObj = cmd.ExecuteScalar();
                        if (xpObj != null && xpObj != DBNull.Value)
                        {
                            int xp = Convert.ToInt32(xpObj);
                            litXP.Text = xp.ToString();
                            
                            int level = Math.Max(1, (xp / 100) + 1);
                            litLevel.Text = level.ToString();
                        }
                    }

                    // 2. Get Quiz History
                    string quizQuery = @"
                        SELECT qr.Id, qs.Title as QuizTitle, qr.Score, qr.Total, qr.Percentage, qr.AttemptDate,
                               CAST(qr.Score AS VARCHAR) + '/' + CAST(qr.Total AS VARCHAR) as ScoreDisplay
                        FROM QuizResults qr
                        JOIN QuizSets qs ON qr.QuizSetId = qs.Id
                        WHERE qr.UserId = @UserId
                        ORDER BY qr.AttemptDate DESC";
                    
                    using (SqlCommand cmd = new SqlCommand(quizQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            DataTable dt = new DataTable();
                            da.Fill(dt);

                            litQuizCount.Text = dt.Rows.Count.ToString();
                            
                            if (dt.Rows.Count > 0)
                            {
                                int totalPct = 0;
                                foreach(DataRow row in dt.Rows)
                                {
                                    totalPct += Convert.ToInt32(row["Percentage"]);
                                }
                                litAvgScore.Text = (totalPct / dt.Rows.Count).ToString();
                            }

                            gvQuizHistory.DataSource = dt;
                            gvQuizHistory.DataBind();
                        }
                    }
                }
            }
            catch (Exception)
            {
                // DB might not be connected, bind empty data for demo purposes
                DataTable dt = new DataTable();
                dt.Columns.Add("QuizTitle");
                dt.Columns.Add("AttemptDate");
                dt.Columns.Add("ScoreDisplay");
                dt.Columns.Add("Percentage");
                
                // Add fake row if DB fails so UI isn't broken
                dt.Rows.Add("Demo Quiz (DB offline)", DateTime.Now.ToString(), "4/5", "80");
                gvQuizHistory.DataSource = dt;
                gvQuizHistory.DataBind();
            }
        }
    }
}
