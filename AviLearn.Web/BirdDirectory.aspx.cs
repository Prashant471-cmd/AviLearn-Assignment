using System;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace AviLearn.Web
{
    public partial class BirdDirectory : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                LoadBirds("");
            }
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            LoadBirds(txtSearch.Text.Trim());
        }

        private void LoadBirds(string searchTerm)
        {
            string connString = ConfigurationManager.ConnectionStrings["AviLearnDB"].ConnectionString;
            DataTable dt = new DataTable();

            try
            {
                using (SqlConnection conn = new SqlConnection(connString))
                {
                    conn.Open();
                    string query = "SELECT Id, CommonName, ScientificName, Family, Description, ConservationStatus, ImageUrl, Habitat, AudioFrequencyHz, AudioPattern FROM BirdSpecies";
                    
                    if (!string.IsNullOrEmpty(searchTerm))
                    {
                        query += " WHERE CommonName LIKE @Search OR ScientificName LIKE @Search";
                    }
                    
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        if (!string.IsNullOrEmpty(searchTerm))
                        {
                            cmd.Parameters.AddWithValue("@Search", "%" + searchTerm + "%");
                        }
                        
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt);
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Fallback mock data if DB isn't connected yet
                dt.Columns.Add("CommonName");
                dt.Columns.Add("ScientificName");
                dt.Columns.Add("Family");
                dt.Columns.Add("Description");
                dt.Columns.Add("ConservationStatus");
                dt.Columns.Add("ImageUrl");
                dt.Columns.Add("Habitat");
                dt.Columns.Add("AudioFrequencyHz");
                dt.Columns.Add("AudioPattern");
                
                dt.Rows.Add("Northern Cardinal", "Cardinalis cardinalis", "Cardinalidae", "A mid-sized songbird with bright red plumage.", "LC", "https://images.unsplash.com/photo-1549608276-5786777e6587", "Woodlands", "1200", "whistle-slide");
                dt.Rows.Add("Blue Jay", "Cyanocitta cristata", "Corvidae", "A passerine bird with blue plumage and a crest.", "LC", "https://images.unsplash.com/photo-1590494444390-e88383c07223", "Forests", "1400", "chirp-repeat");
            }

            if (dt.Rows.Count > 0)
            {
                rptBirds.DataSource = dt;
                rptBirds.DataBind();
                lblNoResults.Visible = false;
            }
            else
            {
                rptBirds.DataSource = null;
                rptBirds.DataBind();
                lblNoResults.Visible = true;
            }
        }
    }
}
