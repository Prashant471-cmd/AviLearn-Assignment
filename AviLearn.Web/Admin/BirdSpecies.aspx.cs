using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;

namespace AviLearn.Web.Admin
{
    public partial class BirdSpecies : System.Web.UI.Page
    {
        string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadBirds();
            }
        }

        private void LoadBirds()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string query = "SELECT Id, CommonName, ScientificName, Family, ConservationStatus FROM BirdSpecies ORDER BY CommonName";
                    using (SqlDataAdapter da = new SqlDataAdapter(query, conn))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);
                        gvBirds.DataSource = dt;
                        gvBirds.DataBind();
                    }
                }
            }
            catch (Exception)
            {
                // Fallback demo data
                DataTable dt = new DataTable();
                dt.Columns.Add("Id");
                dt.Columns.Add("CommonName");
                dt.Columns.Add("ScientificName");
                dt.Columns.Add("Family");
                dt.Columns.Add("ConservationStatus");
                dt.Rows.Add("bird_1", "Northern Cardinal", "Cardinalis cardinalis", "Cardinalidae", "LC");
                gvBirds.DataSource = dt;
                gvBirds.DataBind();
            }
        }

        protected void btnAdd_Click(object sender, EventArgs e)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string insertQuery = @"INSERT INTO BirdSpecies 
                        (Id, CommonName, ScientificName, TaxonomicOrder, Family, Description, ConservationStatus, StatusLabel, RarityLevel, MigrationStatus, ImageUrl, AudioUrl) 
                        VALUES (@Id, @CommonName, @ScientificName, 'Passeriformes', @Family, @Desc, @Status, 'Label', 'Common', 'Resident', @Img, @Audio)";
                    
                    using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", "bird_" + Guid.NewGuid().ToString().Substring(0, 8));
                        cmd.Parameters.AddWithValue("@CommonName", txtCommonName.Text.Trim());
                        cmd.Parameters.AddWithValue("@ScientificName", txtScientificName.Text.Trim());
                        cmd.Parameters.AddWithValue("@Family", txtFamily.Text.Trim());
                        cmd.Parameters.AddWithValue("@Status", ddlStatus.SelectedValue);
                        cmd.Parameters.AddWithValue("@Desc", txtDesc.Text.Trim());
                        cmd.Parameters.AddWithValue("@Img", txtImgUrl.Text.Trim());
                        cmd.Parameters.AddWithValue("@Audio", txtAudioUrl.Text.Trim() == "" ? (object)DBNull.Value : txtAudioUrl.Text.Trim());
                        
                        cmd.ExecuteNonQuery();
                    }
                }
                
                lblMsg.Text = "Species added successfully!";
                lblMsg.Visible = true;
                
                // Clear form
                txtCommonName.Text = "";
                txtScientificName.Text = "";
                txtFamily.Text = "";
                txtDesc.Text = "";
                txtImgUrl.Text = "";
                txtAudioUrl.Text = "";
                
                LoadBirds();
            }
            catch (Exception ex)
            {
                lblMsg.Text = "Error: " + ex.Message;
                lblMsg.Style.Add("color", "red");
                lblMsg.Visible = true;
            }
        }

        protected void gvBirds_RowDeleting(object sender, GridViewDeleteEventArgs e)
        {
            string id = gvBirds.DataKeys[e.RowIndex].Value.ToString();
            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string deleteQuery = "DELETE FROM BirdSpecies WHERE Id = @Id";
                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.ExecuteNonQuery();
                    }
                }
                LoadBirds();
            }
            catch (Exception)
            {
                lblMsg.Text = "Cannot delete demo data without a database connection.";
                lblMsg.Style.Add("color", "red");
                lblMsg.Visible = true;
            }
        }
    }
}
