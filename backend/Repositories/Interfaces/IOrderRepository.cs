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

        //Task<IEnumerable<Order>> GetAllOrdersAsync();

        //Task UpdateOrderAsync(Order order);
        //Task DeleteOrderAsync(int id);
    }
}
