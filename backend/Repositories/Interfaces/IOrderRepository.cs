using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models.Entities;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {

        Task<Order> GetOrderByIdAsync(int id);
        Task AddOrderAsync(Order order);

        //Task<IEnumerable<Order>> GetAllOrdersAsync();
        
        //Task UpdateOrderAsync(Order order);
        //Task DeleteOrderAsync(int id);
    }
}