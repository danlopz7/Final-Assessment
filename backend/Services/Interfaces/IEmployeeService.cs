using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.output;

// Fetch list of Employees
namespace backend.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeSimpleDto>> GetEmployeesAsync();
    }
}