using System.ComponentModel.DataAnnotations.Schema;

namespace CountyAndCities.Models
{
    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Iso2 { get; set; }
        public string Iso3 { get; set; }
        public string? Picture {  get; set; }
        [NotMapped]
        public List<City> Cities { get; set; }
    }
}
