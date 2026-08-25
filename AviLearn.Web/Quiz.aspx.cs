using System;
using System.Configuration;
using System.Data.SqlClient;

namespace AviLearn.Web
{
    public partial class Quiz : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["UserId"] == null)
            {
                Response.Redirect("~/Login.aspx");
            }
        }

        protected void btnSubmitQuiz_Click(object sender, EventArgs e)
        {
            int score = 0;
            int total = 2;
            int xpEarned = 0;

            if (rblQ1.SelectedValue == "1") score++;
            if (rblQ2.SelectedValue == "1") score++;

            xpEarned = score * 25 + 50; // 25 per correct answer + 50 completion bonus

            string userId = Session["UserId"].ToString();
            string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
            
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();

                    // Update XP
                    string updateXp = "UPDATE Users SET XP = XP + @XP WHERE Id = @UserId";
                    using (SqlCommand cmd = new SqlCommand(updateXp, conn))
                    {
                        cmd.Parameters.AddWithValue("@XP", xpEarned);
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        cmd.ExecuteNonQuery();
                    }

                    // Save Result (assuming 'quiz_1' exists in QuizSets, handled gracefully if DB missing)
                    string insertResult = @"
                        IF NOT EXISTS (SELECT * FROM QuizResults WHERE Id = @Id)
                        BEGIN
                            INSERT INTO QuizResults (Id, UserId, QuizSetId, Score, Total, Percentage) 
                            VALUES (@Id, @UserId, 'quiz_1', @Score, @Total, @Pct)
                        END";
                    using (SqlCommand cmd = new SqlCommand(insertResult, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", "res_" + Guid.NewGuid().ToString().Substring(0, 8));
                        cmd.Parameters.AddWithValue("@UserId", userId);
                        cmd.Parameters.AddWithValue("@Score", score);
                        cmd.Parameters.AddWithValue("@Total", total);
                        cmd.Parameters.AddWithValue("@Pct", (score * 100) / total);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception)
            {
                // Ignore DB error, allow UI to show score for demo
            }

            pnlQuiz.Visible = false;
            pnlResult.Visible = true;
            
            litScore.Text = score.ToString();
            litXPEarned.Text = xpEarned.ToString();
        }
    }
}
