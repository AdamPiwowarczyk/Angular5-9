using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DataDisplayAPI.Data;
using DataDisplayAPI.DTOs;
using DataDisplayAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DataDisplayAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        [AllowAnonymous] 
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserToRegisterDto userToRegister)
        {
            userToRegister.Login = userToRegister.Login.ToLower();

            if (await _repo.UserExists(userToRegister.Login))
                return BadRequest("This user alreade exists!");

            var userToCreateBlueprint = new User { Login = userToRegister.Login, IsAdmin = false };
            var createdUser = await _repo.Register(userToCreateBlueprint, userToRegister.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        [AllowAnonymous] 
        public async Task<IActionResult> Login(UserForLoginDto userForLogin)
        {
            var userFromRepo = await _repo.Login(userForLogin.Login.ToLower(), userForLogin.Password);
            if (userFromRepo == null)
                return Unauthorized();

            var userRole = userFromRepo.IsAdmin ? Roles.Admin : Roles.Casual;

            var credentialsClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Login),
                new Claim(ClaimTypes.Role, userRole)
            };

            var credentialsKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var credentials = new SigningCredentials(credentialsKey, SecurityAlgorithms.HmacSha512Signature);

             var tokenConfiguration = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(credentialsClaims),
                Expires = DateTime.Now.AddHours(2.0),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenConfiguration);
            return Ok(new {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}