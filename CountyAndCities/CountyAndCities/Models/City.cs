using System.Text.Json.Serialization;

namespace CountyAndCities.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Lot { get; set; }
        public double Lan { get; set; }
        [JsonIgnore]
        public int CountryId { get; set; }
    }
}
