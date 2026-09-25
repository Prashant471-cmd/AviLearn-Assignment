using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Web.UI.WebControls;
using AviLearn.Web.Services;

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
    //  Here is the code for birdspecies
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

        protected async void btnFetchXenoCanto_Click(object sender, EventArgs e)
        {
            string scientificName = txtScientificName.Text.Trim();
            if (string.IsNullOrEmpty(scientificName))
            {
                lblXenoCantoMsg.Text = "Please enter a scientific name first.";
                lblXenoCantoMsg.Style["color"] = "red";
                lblXenoCantoMsg.Visible = true;
                return;
            }

            try
            {
                lblXenoCantoMsg.Text = "Fetching...";
                lblXenoCantoMsg.Style["color"] = "gray";
                lblXenoCantoMsg.Visible = true;

                XenoCantoService xenoCantoService = new XenoCantoService();
                
                // Fetching the top recording
                string apiKey = ConfigurationManager.AppSettings["XenoCantoApiKey"];
                if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_API_KEY")
                {
                    lblXenoCantoMsg.Text = "Please configure your Xeno-canto API key in Web.config.";
                    lblXenoCantoMsg.Style["color"] = "red";
                    return;
                }

                var response = await xenoCantoService.GetRecordingsAsync(scientificName, apiKey, perPage: 1);

                if (response != null && response.Recordings != null && response.Recordings.Count > 0)
                {
                    var firstRecording = response.Recordings[0];
                    txtAudioUrl.Text = firstRecording.FileUrl;
                    
                    // Populate Image field with sonogram if available
                    if (firstRecording.Sono != null)
                    {
                        if (!string.IsNullOrEmpty(firstRecording.Sono.Large))
                            txtImgUrl.Text = "https:" + firstRecording.Sono.Large;
                        else if (!string.IsNullOrEmpty(firstRecording.Sono.Medium))
                            txtImgUrl.Text = "https:" + firstRecording.Sono.Medium;
                    }

                    lblXenoCantoMsg.Text = "Audio found and loaded!";
                    lblXenoCantoMsg.Style["color"] = "green";
                }
                else
                {
                    lblXenoCantoMsg.Text = "No recordings found.";
                    lblXenoCantoMsg.Style["color"] = "orange";
                }
            }
            catch (Exception ex)
            {
                lblXenoCantoMsg.Text = "Error fetching data: " + ex.Message;
                lblXenoCantoMsg.Style["color"] = "red";
            }
        }
    }
}
