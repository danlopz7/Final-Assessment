using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> GetFirstOrderAsync();
        Task<Order> GetOrderByIdAsync(int id);
        Task AddOrderAsync(Order order);
        Task<Order?> GetNextOrderAsync(int currentId);
        Task<Order?> GetPreviousOrderAsync(int currentId);
        Task<bool> ExistsOrderAfter(int currentId);
        Task<bool> ExistsOrderBefore(int currentId);

        Task<Order> GetOrderByIdWithDetailsAsync(int id);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(int id);

        //Task<IEnumerable<Order>> GetAllOrdersAsync();
    }
}
