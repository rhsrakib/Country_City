using CountyAndCities.Models;

namespace CountyAndCities.Repository
{
    public interface ICountryCityRepo
    {
        Task<IEnumerable<Country>> GetAllCountries();
        Task<Country> GetCountryById(int id);
        Task<Country> AddCountry(Country country);
        Task UpdateCountry(Country country);
        Task DeleteCountry(int id);

        Task<IEnumerable<City>> GetCitiesByCountryId(int countryId);
        Task<City> GetCityById(int id);
        Task<City> AddCity(City city);
        Task UpdateCity(City city);
        Task DeleteCity(int id);
    }
}
