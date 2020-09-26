using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataDisplayAPI.DTOs;
using DataDisplayAPI.Helpers;
using DataDisplayAPI.Models;

namespace DataDisplayAPI.Data
{
    public interface IPeopleRepository
    {
        Task<PagedList<Person>> GetAllPeople(PeopleParamsDto peopleParams);
        Task<Person> GetOnePerson(Guid id);
        Task<Guid> CreatePerson(PersonToAddDto personToAdd);
        Task<bool> EditPerson(PersonToEditDto personToEdit);
        Task<bool> DeletePerson(Guid id);
        Task<bool> SaveAll();
    }
}