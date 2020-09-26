using System;
using System.Linq;
using System.Threading.Tasks;
using DataDisplayAPI.Data;
using DataDisplayAPI.DTOs;
using DataDisplayAPI.Helpers;
using DataDisplayAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DataDisplayAPI.Controllers
{
    [Authorize(Roles = "Casual, Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : ControllerBase
    {
        private readonly IPeopleRepository _repo;

        public PeopleController(IPeopleRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPeople([FromQuery]PeopleParamsDto peopleParams)
        {
            try
            {
                var peoplePaged = await _repo.GetAllPeople(peopleParams);
                if (peoplePaged == null)
                    return (IActionResult) NotFound();

                Response.AddPagination(peoplePaged.CurrentPage, peoplePaged.PageSize, peoplePaged.TotalCount, peoplePaged.AllPages);    

                return Ok(peoplePaged.AsEnumerable());
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
  
        [Produces("text/csv")]
        [HttpGet("csv")]
        public async Task<IActionResult> GetAllPeopleCsv([FromQuery]PeopleParamsDto peopleParams)
        {
            try {
                var peoplePaged = await _repo.GetAllPeople(peopleParams);
                if (peoplePaged == null)
                    return (IActionResult) NotFound();

                var peoplePagedCsvString = CsvConverter.ToCsv(peoplePaged);

                var peoplePagedCsv = System.Text.Encoding.UTF8.GetBytes(peoplePagedCsvString);
                string fileName = "people.csv";

                return File(peoplePagedCsv, "text/csv", fileName);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

              
        [HttpGet("{id}")] 
        public async Task<IActionResult> GetOnePerson(Guid id)
        {
            try
            {
                var person = await _repo.GetOnePerson(id);
                return person == null ? (IActionResult) NotFound() : Ok(person);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
        
 
        [Authorize(Roles = Roles.Admin)]
        [HttpPost]
        public async Task<IActionResult> CreatePerson(PersonToAddDto personToAdd)
        {
            try
            {
                var guid = await _repo.CreatePerson(personToAdd);
                return guid == Guid.Empty ? (IActionResult) StatusCode(500) : Ok(guid);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }   
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPut]
        public async Task<IActionResult> EditPerson(PersonToEditDto personToEdit)
        {
            if (personToEdit.PersonId == Guid.Empty)
                return NotFound();
            
            try
            {
                var edited = await _repo.EditPerson(personToEdit);
                return edited ? Ok() : StatusCode(500);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
        
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(Guid id)
        {
            if (id == Guid.Empty)
                return BadRequest();
            
            try
            {
                var wasDeleted = await _repo.DeletePerson(id);
                return wasDeleted ? Ok() : StatusCode(404);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }  
        }
    }
}