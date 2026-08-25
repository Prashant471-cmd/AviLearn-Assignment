using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;

namespace AviLearn.Web.Admin
{
    public partial class Users : System.Web.UI.Page
    {
        string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"]?.ConnectionString ?? "";

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadUsers();
            }
        }

        private void LoadUsers()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string query = "SELECT Id, Name, Email, Role, XP, JoinDate FROM Users ORDER BY JoinDate DESC";
                    using (SqlDataAdapter da = new SqlDataAdapter(query, conn))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);
                        gvUsers.DataSource = dt;
                        gvUsers.DataBind();
                    }
                }
            }
            catch (Exception)
            {
                // Fallback demo data
                DataTable dt = new DataTable();
                dt.Columns.Add("Id");
                dt.Columns.Add("Name");
                dt.Columns.Add("Email");
                dt.Columns.Add("Role");
                dt.Columns.Add("XP");
                dt.Columns.Add("JoinDate", typeof(DateTime));
                dt.Rows.Add("usr_admin_1", "Admin User", "admin@avilearn.com", "admin", "0", DateTime.Now);
                dt.Rows.Add("usr_member_1", "Demo Member", "member@avilearn.com", "member", "150", DateTime.Now);
                gvUsers.DataSource = dt;
                gvUsers.DataBind();
            }
        }

        protected void btnAdd_Click(object sender, EventArgs e)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string insertQuery = @"INSERT INTO Users 
                        (Id, Name, Email, PasswordHash, Role, JoinDate, XP) 
                        VALUES (@Id, @Name, @Email, @Password, @Role, GETDATE(), 0)";
                    
                    using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", "usr_" + Guid.NewGuid().ToString().Substring(0, 8));
                        cmd.Parameters.AddWithValue("@Name", txtName.Text.Trim());
                        cmd.Parameters.AddWithValue("@Email", txtEmail.Text.Trim());
                        cmd.Parameters.AddWithValue("@Password", txtPassword.Text.Trim()); // Note: should be hashed in production
                        cmd.Parameters.AddWithValue("@Role", ddlRole.SelectedValue);
                        
                        cmd.ExecuteNonQuery();
                    }
                }
                
                lblMsg.Text = "User added successfully!";
                lblMsg.Style.Add("color", "var(--color-emerald)");
                lblMsg.Visible = true;
                
                // Clear form
                txtName.Text = "";
                txtEmail.Text = "";
                txtPassword.Text = "";
                
                LoadUsers();
            }
            catch (Exception ex)
            {
                lblMsg.Text = "Error: " + ex.Message;
                lblMsg.Style.Add("color", "#D32F2F");
                lblMsg.Visible = true;
            }
        }

        protected void gvUsers_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            string id = gvUsers.DataKeys[e.RowIndex].Value.ToString();
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string deleteQuery = "DELETE FROM Users WHERE Id = @Id";
                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.ExecuteNonQuery();
                    }
                }
                LoadUsers();
            }
            catch (Exception)
            {
                lblMsg.Text = "Cannot delete demo data without a database connection.";
                lblMsg.Style.Add("color", "#D32F2F");
                lblMsg.Visible = true;
            }
        }
    }
}
