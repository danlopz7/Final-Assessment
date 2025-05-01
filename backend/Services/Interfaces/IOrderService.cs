using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;

// Fetch one Order by ID and Create Order
namespace backend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> GetFirstOrderAsync();
        Task<OrderDto> GetOrderByIdAsync(int id);
        Task<OrderDto> GetNextOrderAsync(int id);
        Task<OrderDto> GetPreviousOrderAsync(int id);
        Task<bool> ExistsOrderAfterAsync(int currentId);
        Task<bool> ExistsOrderBeforeAsync(int currentId);
        Task<OrderDto> CreateOrderAsync(OrderDto dto);
    }
}
