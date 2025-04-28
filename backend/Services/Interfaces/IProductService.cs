using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;

// 	Fetch list of Products
namespace backend.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductSimpleDto>> GetProductsAsync();
    }
}