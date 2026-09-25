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

                // Xeno-Canto API v3 requires an API key and strictly tagged queries. 
                // We use WebClient for immediate dynamic compilation compatibility.
                using (var client = new System.Net.WebClient())
                {
                    client.Headers.Add("User-Agent", "AviLearnApp/1.0");
                    
                    string apiKey = ConfigurationManager.AppSettings["XenoCantoApiKey"];
                    if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_API_KEY")
                    {
                        lblXenoCantoMsg.Text = "Please configure your Xeno-canto API key in Web.config.";
                        lblXenoCantoMsg.Style["color"] = "red";
                        return;
                    }

                    // In v3, untagged queries are disabled. We MUST wrap the scientific name in the sp: tag
                    // Note: Tags must be separated by a SPACE, not a plus sign, otherwise it throws a 400 Bad Request
                    string encodedQuery = Uri.EscapeDataString("sp:\"" + scientificName + "\" grp:birds");
                    string url = "https://xeno-canto.org/api/3/recordings?query=" + encodedQuery + "&key=" + Uri.EscapeDataString(apiKey);
                    
                    string jsonResponse = await client.DownloadStringTaskAsync(url);
                    
                    dynamic data = Newtonsoft.Json.JsonConvert.DeserializeObject(jsonResponse);

                    if (data != null && data.recordings != null && data.recordings.Count > 0)
                    {
                        var firstRec = data.recordings[0];
                        txtAudioUrl.Text = firstRec.file;
                        
                        if (firstRec.sono != null)
                        {
                            if (firstRec.sono.large != null) txtImgUrl.Text = "https:" + firstRec.sono.large;
                            else if (firstRec.sono.med != null) txtImgUrl.Text = "https:" + firstRec.sono.med;
                        }

                        lblXenoCantoMsg.Text = "Audio found and loaded successfully!";
                        lblXenoCantoMsg.Style["color"] = "green";
                    }
                    else
                    {
                        lblXenoCantoMsg.Text = "No recordings found.";
                        lblXenoCantoMsg.Style["color"] = "orange";
                    }
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
