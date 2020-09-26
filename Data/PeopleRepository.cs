using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DataDisplayAPI.DTOs;
using DataDisplayAPI.Helpers;
using DataDisplayAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace DataDisplayAPI.Data
{
    public class PeopleRepository : IPeopleRepository
    {
        private readonly DataContext _context;

        public PeopleRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<PagedList<Person>> GetAllPeople(PeopleParamsDto peopleParams)
        {
            var users = _context.People.AsQueryable();

            // Filtrowanie
            if (!String.IsNullOrEmpty(peopleParams.FirstName)) {
                users = users.Where(x => x.FirstName == peopleParams.FirstName);
            } 
            if (!String.IsNullOrEmpty(peopleParams.LastName)) {
                users = users.Where(x => x.LastName == peopleParams.LastName);
            }
            if (!String.IsNullOrEmpty(peopleParams.Occupation)) {
                users = users.Where(x => x.Occupation == peopleParams.Occupation);
            } 

            // Sortowanie
            switch (peopleParams.OrderBy)
            {
                case "firstName":
                    users = users.OrderBy(x => x.FirstName);
                    break;
                case "firstNameDescending":
                    users = users.OrderByDescending(x => x.FirstName);
                    break;
                case "lastName":
                    users = users.OrderBy(x => x.LastName);
                    break;
                case "lastNameDescending":
                    users = users.OrderByDescending(x => x.LastName);
                    break;
            }    

            return await PagedList<Person>.CreateAsync(users, peopleParams.PageNumber, peopleParams.PageSize);
        }

        public async Task<Person> GetOnePerson(Guid id)
        {
           return await _context.People.FirstOrDefaultAsync(x => x.PersonId == id);
        }

        public async Task<Guid> CreatePerson(PersonToAddDto personToAdd)
        {
            var person = new Person()
            {
                PersonId = Guid.NewGuid(), Occupation = personToAdd.Occupation,
                AvatarUrl = personToAdd.AvatarUrl, FirstName = personToAdd.FirstName, LastName = personToAdd.LastName
            };

            await _context.People.AddAsync(person);
            await SaveAll();
            return person.PersonId;
        }

        public async Task<bool> EditPerson(PersonToEditDto personToEdit)
        {
            var person = await _context.People.FirstOrDefaultAsync(x => x.PersonId == personToEdit.PersonId);
            if (person == null)
                return false;
            else
            {
                if (!String.IsNullOrEmpty(personToEdit.Occupation))
                    person.Occupation = personToEdit.Occupation;
                if (!String.IsNullOrEmpty(personToEdit.AvatarUrl))
                    person.AvatarUrl = personToEdit.AvatarUrl;
                if (!String.IsNullOrEmpty(personToEdit.FirstName))
                    person.FirstName = personToEdit.FirstName;        
                if (!String.IsNullOrEmpty(personToEdit.LastName))
                    person.LastName = personToEdit.LastName;

                await _context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<bool> DeletePerson(Guid id)
        {
            var person = await _context.People.SingleOrDefaultAsync(x => x.PersonId == id);
            if (person == null)
                return false;
            else
            {
                _context.People.Remove(person);
                await SaveAll();
                return true;
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}