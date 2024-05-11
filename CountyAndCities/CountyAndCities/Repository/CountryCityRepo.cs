using CountyAndCities.Models;
using Microsoft.EntityFrameworkCore;

namespace CountyAndCities.Repository
{
    public class CountryCityRepo : ICountryCityRepo
    {
        private readonly AppDbContext _context;

        public CountryCityRepo(AppDbContext context)
        {
            _context = context;
        }

        // Country methods
        public async Task<IEnumerable<Country>> GetAllCountries()
        {
            return await _context.Countries.ToListAsync();
        }

        public async Task<Country> GetCountryById(int id)
        {
            return await _context.Countries.FindAsync(id);
        }

        public async Task<Country> AddCountry(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
            return country;
        }

        public async Task UpdateCountry(Country country)
        {
            _context.Entry(country).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCountry(int id)
        {
            var country = await _context.Countries.FindAsync(id);
            if (country != null)
            {
                _context.Countries.Remove(country);
                await _context.SaveChangesAsync();
            }
        }

        // City methods
        public async Task<IEnumerable<City>> GetCitiesByCountryId(int countryId)
        {
            return await _context.Cities.Where(c => c.CountryId == countryId).ToListAsync();
        }

        public async Task<City> GetCityById(int id)
        {
            return await _context.Cities.FindAsync(id);
        }

        public async Task<City> AddCity(City city)
        {
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return city;
        }

        public async Task UpdateCity(City city)
        {
            _context.Entry(city).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city != null)
            {
                _context.Cities.Remove(city);
                await _context.SaveChangesAsync();
            }
        }
    }
}
