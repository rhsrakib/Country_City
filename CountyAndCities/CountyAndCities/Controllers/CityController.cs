using CountyAndCities.Models;
using CountyAndCities.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CountyAndCities.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ICountryCityRepo _commonRepo;
        private IWebHostEnvironment _web;
        private readonly AppDbContext _context;
        public CityController(ICountryCityRepo commonRepo, IWebHostEnvironment web, AppDbContext context)
        {
            _commonRepo = commonRepo;
            _web = web;
            _context = context;
        }

        [HttpGet("GetAllCountriesWithCities")]
        public async Task<IActionResult> GetAllCountriesWithCities()
        {
            try
            {
                var countries = await _commonRepo.GetAllCountries();
                var countriesWithCities = new List<CountryWithCities>();

                foreach (var country in countries)
                {
                    var cities = await _commonRepo.GetCitiesByCountryId(country.Id);
                    countriesWithCities.Add(new CountryWithCities { Country = country, Cities = cities.ToList() });
                    // Explicitly convert IEnumerable<City> to List<City>
                }

                return Ok(countriesWithCities);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving countries and cities: {ex.Message}");
            }
        }

        [HttpGet("GetCountryWithCitiesbyId/{countryId}")]
        public async Task<IActionResult> GetCountryWithCitiesbyId(int countryId)
        {
            try
            {
                var country = await _commonRepo.GetCountryById(countryId);
                if (country == null)
                    return NotFound("Country not found.");

                var cities = await _commonRepo.GetCitiesByCountryId(countryId);
                return Ok(new { Country = country, Cities = cities });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving country and cities: {ex.Message}");
            }
        }

        [HttpPost("AddCountryAndCities")]
        public async Task<IActionResult> AddCountryAndCities(CountryWithCities countryWithCities)
        {
            try
            {
                var addedCountry = await _commonRepo.AddCountry(countryWithCities.Country);
                foreach (var city in countryWithCities.Cities)
                {
                    city.CountryId = addedCountry.Id;
                    await _commonRepo.AddCity(city);
                }

                return Ok(new { Country = addedCountry, Cities = countryWithCities.Cities });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding country and cities: {ex.Message}");
            }
        }



        [HttpPut("PutCountryAndCities/{countryId}")]
        public async Task<IActionResult> PutCountryAndCities(int countryId, Country obj)
        {
            try
            {
                if (countryId == 0)
                    return BadRequest("Country ID must be provided.");

                var existingCountry = await _commonRepo.GetCountryById(obj.Id);
                if (existingCountry == null)
                    return NotFound("Country not found.");

                existingCountry.Name = obj.Name;
                existingCountry.Iso2 = obj.Iso2;
                existingCountry.Iso3 = obj.Iso3;

                await _commonRepo.UpdateCountry(existingCountry);

                var updatedCities = new List<City>();
                foreach (var city in obj.Cities)
                {
                    if (city.Id == 0)
                    {
                        city.CountryId = existingCountry.Id;
                        var addedCity = await _commonRepo.AddCity(city);
                        updatedCities.Add(addedCity);
                    }
                    else
                    {
                        var existingCity = await _commonRepo.GetCityById(city.Id);
                        if (existingCity == null || existingCity.CountryId != existingCountry.Id)
                            return NotFound("City not found.");

                        existingCity.Name = city.Name;
                        existingCity.Lot = city.Lot;
                        existingCity.Lan = city.Lan;
                        await _commonRepo.UpdateCity(existingCity);
                        updatedCities.Add(existingCity);
                    }
                }

                // Remove cities that were not included in the updatedCities list from the database
                var existingCities = await _commonRepo.GetCitiesByCountryId(existingCountry.Id);
                var deletedCities = existingCities.Where(ec => !updatedCities.Any(uc => uc.Id == ec.Id)).ToList();
                foreach (var deletedCity in deletedCities)
                {
                    await _commonRepo.DeleteCity(deletedCity.Id);
                }

                return Ok(new { Country = existingCountry, Cities = updatedCities });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating country and cities: {ex.Message}");
            }
        }



        [HttpDelete("DeleteCountryAndCities/{countryId}")]
        public async Task<IActionResult> DeleteCountryAndCities(int countryId)
        {
            try
            {
                var existingCountry = await _commonRepo.GetCountryById(countryId);
                if (existingCountry == null)
                    return NotFound("Country not found.");

                var cities = await _commonRepo.GetCitiesByCountryId(countryId);
                foreach (var city in cities)
                {
                    await _commonRepo.DeleteCity(city.Id);
                }

                await _commonRepo.DeleteCountry(countryId);

                return Ok(new { message = "Country and its associated cities have been deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }
        [HttpPost("Upload/{id}")]
        public async Task<ActionResult<UploadResponse>> Upload(int id, IFormFile file)
        {
            var country = await _commonRepo.GetCountryById(id);
            if (country == null)
                return NotFound("Country not found.");
            string ext=Path.GetExtension(file.FileName);
            string fileName=Path.GetFileNameWithoutExtension(Path.GetRandomFileName())+ext;
            string savePath=Path.Combine(this._web.WebRootPath,"*Pictures*", fileName);
            if (!Directory.Exists(Path.Combine(this._web.WebRootPath, "*Pictures*")))
            {
                Directory.CreateDirectory(Path.Combine(this._web.WebRootPath, "Pictures"));
            }
            FileStream fs=new FileStream(savePath, FileMode.Create);
            await file.CopyToAsync(fs);
            fs.Close();
            country.Picture = fileName;
           _context.SaveChangesAsync();
            return new UploadResponse{ FileName = country.Picture };
            
        }
    }
}
