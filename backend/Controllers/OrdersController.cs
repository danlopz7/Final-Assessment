using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs.input;
using backend.DTOs.output;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // GET /api/orders/first
        [HttpGet("first")]
        public async Task<IActionResult> GetFirstOrder()
        {
            var order = await _orderService.GetFirstOrderAsync();
            if (order == null)
                return NotFound();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }

        // GET /api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();

            var result = await BuildNavigationResult(id, order);
            return Ok(result);
        }

        // POST /api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrUpdateOrder([FromBody] OrderInputDto dto)
        {
            var result = await _orderService.CreateOrUpdateOrderAsync(dto);
            return Ok(result);
        }

        // DELETE /api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var success = await _orderService.DeleteOrderAsync(id);
            if (!success)
                return NotFound();

            return NoContent(); // 204 No Content
        }

        private async Task<NavigationResultDto> BuildNavigationResult(int orderId, OrderDto order)
        {
            var hasNext = await _orderService.ExistsOrderAfterAsync(orderId);
            var hasPrevious = await _orderService.ExistsOrderBeforeAsync(orderId);

            return new NavigationResultDto
            {
                Order = order,
                HasNext = hasNext,
                HasPrevious = hasPrevious,
            };
        }

        // GET /api/orders/{id}/next
        [HttpGet("{id}/next")]
        public async Task<IActionResult> GetNextOrder(int id)
        {
            var order = await _orderService.GetNextOrderAsync(id);
            if (order == null)
                return NoContent();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }

        // GET /api/orders/{id}/previous
        [HttpGet("{id}/previous")]
        public async Task<IActionResult> GetPreviousOrder(int id)
        {
            var order = await _orderService.GetPreviousOrderAsync(id);
            if (order == null)
                return NoContent();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }
    }
}
