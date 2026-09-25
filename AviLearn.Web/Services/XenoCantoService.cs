using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AviLearn.Web.Services
{
    public class XenoCantoResponse
    {
        [JsonProperty("numRecordings")]
        public string NumRecordings { get; set; }
        
        [JsonProperty("numSpecies")]
        public string NumSpecies { get; set; }
        
        [JsonProperty("page")]
        public int Page { get; set; }
        
        [JsonProperty("numPages")]
        public int NumPages { get; set; }
        
        [JsonProperty("recordings")]
        public List<Recording> Recordings { get; set; }
    }

    public class Sonogram
    {
        [JsonProperty("small")]
        public string Small { get; set; }
        
        [JsonProperty("med")]
        public string Medium { get; set; }
        
        [JsonProperty("large")]
        public string Large { get; set; }
        
        [JsonProperty("full")]
        public string Full { get; set; }
    }

    public class Recording
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("gen")]
        public string Genus { get; set; }
        
        [JsonProperty("sp")]
        public string Species { get; set; }
        
        [JsonProperty("en")]
        public string EnglishName { get; set; }
        
        [JsonProperty("rec")]
        public string Recordist { get; set; }
        
        [JsonProperty("cnt")]
        public string Country { get; set; }
        
        [JsonProperty("loc")]
        public string Location { get; set; }
        
        [JsonProperty("file")]
        public string FileUrl { get; set; }
        
        [JsonProperty("length")]
        public string Length { get; set; }
        
        [JsonProperty("q")]
        public string Quality { get; set; }
        
        [JsonProperty("url")]
        public string Url { get; set; }
        
        [JsonProperty("sono")]
        public Sonogram Sono { get; set; }
    }

    public class XenoCantoService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://xeno-canto.org/api/2/recordings";

        public XenoCantoService()
        {
            _httpClient = new HttpClient();
            // Important for Xeno-canto API as they block blank user agents
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "AviLearnApp/1.0");
        }

        /// <summary>
        /// Fetches bird audio recordings from the Xeno-canto API v2.
        /// </summary>
        public async Task<XenoCantoResponse> GetRecordingsAsync(string scientificName, string apiKey = null, int perPage = 100, int? page = null)
        {
            if (string.IsNullOrWhiteSpace(scientificName))
            {
                throw new ArgumentException("Scientific name must be provided.", nameof(scientificName));
            }

            try
            {
                // Xeno-canto API v2 expects the scientific name directly without sp:"" because Genus and Species are separate tags internally
                string queryValue = Uri.EscapeDataString(scientificName);
                
                // Construct the request URL
                string requestUrl = $"{BaseUrl}?query={queryValue}";

                // Add optional parameters if applicable (though v2 uses page natively, not per_page)
                if (page.HasValue)
                {
                    requestUrl += $"&page={page.Value}";
                }

                // Send the HTTP GET request
                HttpResponseMessage response = await _httpClient.GetAsync(requestUrl);

                // Ensure success status code (throws HttpRequestException for non-2xx responses)
                response.EnsureSuccessStatusCode();

                // Read the response content as a string
                string jsonResponse = await response.Content.ReadAsStringAsync();

                // Deserialize the JSON payload into our strongly typed model
                XenoCantoResponse xenoCantoResponse = JsonConvert.DeserializeObject<XenoCantoResponse>(jsonResponse);

                return xenoCantoResponse ?? new XenoCantoResponse { Recordings = new List<Recording>() };
            }
            catch (HttpRequestException httpEx)
            {
                // Handle HTTP errors (e.g., 404, 500, rate limits)
                throw new Exception($"Network failure or invalid API response from Xeno-canto API: {httpEx.Message}", httpEx);
            }
            catch (JsonException jsonEx)
            {
                // Handle JSON deserialization errors
                throw new Exception($"Error parsing the response from Xeno-canto API: {jsonEx.Message}", jsonEx);
            }
            catch (Exception ex)
            {
                // Handle any other unexpected errors
                throw new Exception($"An unexpected error occurred while fetching recordings: {ex.Message}", ex);
            }
        }
    }
}
