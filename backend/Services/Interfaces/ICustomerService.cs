using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;

// Fetch list of Customers
namespace backend.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerSimpleDto>> GetCustomersAsync();
    }
}