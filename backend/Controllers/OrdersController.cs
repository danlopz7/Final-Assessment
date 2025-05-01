using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DTOs;
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
            if (order == null) return NotFound();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }

        // GET /api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound();

            var result = await BuildNavigationResult(id, order);
            return Ok(result);
        }

        // GET /api/orders/{id}/next
        [HttpGet("{id}/next")]
        public async Task<IActionResult> GetNextOrder(int id)
        {
            var order = await _orderService.GetNextOrderAsync(id);
            if (order == null) return NoContent();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }

        // GET /api/orders/{id}/previous
        [HttpGet("{id}/previous")]
        public async Task<IActionResult> GetPreviousOrder(int id)
        {
            var order = await _orderService.GetPreviousOrderAsync(id);
            if (order == null) return NoContent();

            var result = await BuildNavigationResult(order.OrderId, order);
            return Ok(result);
        }

        // POST /api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
        {
            var created = await _orderService.CreateOrderAsync(orderDto);
            return CreatedAtAction(nameof(GetOrderById), new { id = created.OrderId }, created);
        }


        private async Task<NavigationResultDto> BuildNavigationResult(int orderId, OrderDto order)
        {
            var hasNext = await _orderService.ExistsOrderAfterAsync(orderId);
            var hasPrevious = await _orderService.ExistsOrderBeforeAsync(orderId);

            return new NavigationResultDto
            {
                Order = order,
                HasNext = hasNext,
                HasPrevious = hasPrevious
            };
        }



        /* // Create a new order
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderDto orderDto)
        {
            var createdOrder = await _orderService.CreateOrderAsync(orderDto);
            return CreatedAtAction(
                nameof(GetOrderById),
                new { id = createdOrder.OrderId },
                createdOrder
            );
        } */

        /* [HttpGet("{id}/next")]
        public async Task<IActionResult> GetNextOrder(int id)
        {
            var nextOrder = await _orderService.GetNextOrderAsync(id);
            if (nextOrder == null)
                return NoContent(); // 204 cuando no hay siguiente

            return Ok(nextOrder);
        }

        [HttpGet("{id}/previous")]
        public async Task<IActionResult> GetPreviousOrder(int id)
        {
            var previousOrder = await _orderService.GetPreviousOrderAsync(id);
            if (previousOrder == null)
                return NoContent(); // 204 cuando no hay anterior

            return Ok(previousOrder);
        } */
    }
}
