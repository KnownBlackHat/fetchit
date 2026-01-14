import { PlaceOrder } from "@/types";
import type { Request, Response } from "express";
import client from "@/lib/db"
import { CustomError, ParseError, UnauthorizedError } from "@/utils/errorClasses";

export async function placeOrder(req: Request, res: Response) {
    const parsedData = PlaceOrder.safeParse(req.body);
    if (!parsedData.success) {
        throw new ParseError()
    }
    let ids = parsedData.data.map(item => item.id);
    let items = await client.inventory.findMany({
        where: {
            id: { in: ids },
            shopId: req.params.shopid
        },
        select: { id: true, price: true, count: true }
    });

    if (ids.length !== items.length) {
        throw new CustomError("Invalid item id")
    }

    if (items.length === 0) {
        throw new CustomError("No items in order");
    }

    let totalPrice = 0;
    let orderItems = [];
    for (const item of items) {
        let requestedItem = parsedData.data.find(x => x.id === item.id);
        if (item.count < requestedItem!.count) {
            throw new CustomError("Not enough item");
        }
        totalPrice += (item.price * requestedItem!.count);

        orderItems.push({
            quantity: requestedItem!.count,
            priceAtTime: item.price,
            inventory: {
                connect: {
                    id: requestedItem!.id
                }
            }

        });
    }

    let order = await client.$transaction(async (tx) => {
        let usrAddr = await tx.userAddress.findUnique({
            where: {
                userId: req.usrId
            }
        })
        if (!usrAddr) {
            throw new CustomError("User address not found");
        }
        const newOrder = await tx.orders.create({
            data: {
                totalprice: totalPrice,
                shopId: req.params.shopid,
                status: "PENDING",
                items: {
                    create: orderItems
                },
                addressId: usrAddr!.id
            },
            include: { items: true }
        });

        for (const item of items) {
            await tx.inventory.update({
                where: { id: item.id },
                data: {
                    count: {
                        decrement: orderItems.find(x => x.inventory.connect.id === item.id)!.quantity
                    }
                }
            });
        }
        return newOrder;
    });

    res.json({
        success: true,
        order_id: order.id
    });


}


export async function getUserActiveOrder(req: Request, res: Response) {
    const orders = await client.orders.findMany({
        where: {
            address: {
                userId: req.usrId
            },
            status: {
                not: "DELIVERED"
            }
        },
        include: {
            shop: {
                select: {
                    id: true,
                }
            },
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        },
    });

    if (orders.length <= 0) {
        res.json({});
        return;
    }
    const groupedByShop: Record<string, any[]> = {};

    orders.forEach(order => {
        const shopId = order.shop.id
        const formattedItems = order.items.map(item => ({
            id: item.inventory.id,
            name: item.inventory.name,
            price: item.inventory.price,
            image_url: item.inventory.img_url,
            count: item.quantity,
        }));

        if (!groupedByShop[shopId]) {
            groupedByShop[shopId] = []
        }

        groupedByShop[shopId].push(...formattedItems);
    })
    res.json(groupedByShop)
}

export async function getUserHistoryOrder(req: Request, res: Response) {
    const orders = await client.orders.findMany({
        where: {
            address: {
                userId: req.usrId
            },
            status: "DELIVERED"
        },
        include: {
            shop: {
                select: {
                    id: true,
                }
            },
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        },
    });

    if (orders.length <= 0) {
        res.json({});
        return;
    }
    const groupedByShop: Record<string, any[]> = {};

    orders.forEach(order => {
        const shopId = order.shop.id
        const formattedItems = order.items.map(item => ({
            id: item.inventory.id,
            name: item.inventory.name,
            price: item.inventory.price,
            image_url: item.inventory.img_url,
            count: item.quantity,
        }));

        if (!groupedByShop[shopId]) {
            groupedByShop[shopId] = []
        }

        groupedByShop[shopId].push(...formattedItems);
    })
    res.json(groupedByShop)
}

export async function getVendorActiveOrder(req: Request, res: Response) {
    const orders = await client.orders.findMany({
        where: {
            shopId: req.vendorId,
            status: { not: "DELIVERED" }
        },
        include: {
            shop: {
                select: {
                    id: true,
                }
            },
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        },
    });

    if (orders.length <= 0) {
        res.json({});
        return;
    }
    const groupedByOrder: Record<string, any[]> = {};

    orders.forEach(order => {
        const orderId = order.id
        const formattedItems = order.items.map(item => ({
            id: item.inventory.id,
            name: item.inventory.name,
            price: item.inventory.price,
            image_url: item.inventory.img_url,
            count: item.quantity,
        }));

        if (!groupedByOrder[orderId]) {
            groupedByOrder[orderId] = []
        }

        groupedByOrder[orderId].push(...formattedItems);
    })
    res.json(groupedByOrder)
}

export async function getVendorHistoryOrder(req: Request, res: Response) {
    const orders = await client.orders.findMany({
        where: {
            shopId: req.vendorId,
            status: "DELIVERED"
        },
        include: {
            shop: {
                select: {
                    id: true,
                }
            },
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        },
    });

    if (orders.length <= 0) {
        res.json({});
        return;
    }
    const groupedByOrder: Record<string, any[]> = {};

    orders.forEach(order => {
        const orderId = order.id
        const formattedItems = order.items.map(item => ({
            id: item.inventory.id,
            name: item.inventory.name,
            price: item.inventory.price,
            image_url: item.inventory.img_url,
            count: item.quantity,
        }));

        if (!groupedByOrder[orderId]) {
            groupedByOrder[orderId] = []
        }

        groupedByOrder[orderId].push(...formattedItems);
    })
    res.json(groupedByOrder)
}

export async function completeOrder(req: Request, res: Response) {
    const orderId = req.params.orderid;

    const order = await client.orders.findUnique({
        where: {
            id: orderId
        }
    });

    if (!order) {
        throw new CustomError("Order not found");
    }

    if (order.deliveryId !== req.usrId) {
        throw new UnauthorizedError();
    }


    if (order.status === "DELIVERED") {
        throw new CustomError("Order already delivered");
    }

    await client.orders.update({
        where: {
            id: orderId
        },
        data: {
            status: "DELIVERED"
        }
    });

    res.json({
        success: true,
        order_id: orderId
    });
}

export async function getOrderStatus(req: Request, res: Response) {
    const orders = await client.orders.findUnique({
        where: {
            id: req.params.orderid
        },
        select: {
            status: true,
            delivery: {
                select: {
                    id: true,
                    username: true,
                    phone_no: true,
                    img_url: true,
                }
            },
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        }

    });
    if (!orders) {
        throw new CustomError("Order not found");
    }

    const formattedItems = orders.items.map(item => ({
        id: item.inventory.id,
        name: item.inventory.name,
        price: item.inventory.price,
        image_url: item.inventory.img_url,
        count: item.quantity,
    }));
    res.json({
        items: formattedItems,
        status: orders.status,
        delivery_agent: orders.delivery ? {
            id: orders.delivery.id,
            name: orders.delivery.username,
            phoneno: Number(orders.delivery.phone_no),
            image_url: orders.delivery.img_url,
        } : null
    });

}



export async function getOrderStatusDelivery(req: Request, res: Response) {
    const orders = await client.orders.findUnique({
        where: {
            id: req.params.orderid
        },
        select: {
            address: true,
            delivery: true,
            items: {
                select: {
                    quantity: true,
                    inventory: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            img_url: true,
                        }
                    }
                }
            }
        }

    });
    if (!orders) {
        throw new CustomError("Order not found");
    }

    if (orders.delivery?.id !== req.usrId) {
        throw new UnauthorizedError();
    }

    const formattedItems = orders.items.map(item => ({
        id: item.inventory.id,
        name: item.inventory.name,
        price: item.inventory.price,
        image_url: item.inventory.img_url,
        count: item.quantity,
    }));
    res.json({
        delivery_address: {
            line1: orders.address.line1,
            line2: orders.address.line2,
            landmark: orders.address.landmark,
            city: orders.address.city,
            postal_code: orders.address.postal_code,
        },
        items: formattedItems,
    });

}


export async function getDeliveryId(req: Request, res: Response) {
    let intermediateOrderId;
    await client.$transaction(async (tx) => {
        const order = await tx.orders.findUnique({
            where: {
                id: req.params.orderid
            }, select: {
                address: true,
                id: true
            }
        })

        if (!order) {
            throw new CustomError("Order id not found", 404);
        }

        intermediateOrderId = await tx.orderIntermidates.findUnique({
            where: {
                orderId: order.id
            }
        });

        if (!intermediateOrderId) {
            intermediateOrderId = await tx.orderIntermidates.create({
                data: {
                    orderId: order.id,
                    address: order.address.line1
                }
            });
        }

    });

    res.json({
        id: intermediateOrderId
    })
}

export async function getDeliveryList(req: Request, res: Response) {
    const intermediates = await client.orderIntermidates.findMany();
    const intermediateMap = intermediates.map(item => ({
        orderId: item.orderId,
        address: item.address
    }));
    res.json({ orders: intermediateMap })
}

export async function acceptDelivery(req: Request, res: Response) {
    await client.$transaction(async (tx) => {
        const order = await tx.orders.findUnique({
            where: {
                id: req.params.orderid
            }, select: {
                address: true,
                id: true
            }
        })

        if (!order) {
            throw new CustomError("Order id not found", 404);
        }

        await tx.orderIntermidates.delete({
            where: {
                orderId: order.id
            }
        });

        await tx.orders.update({
            where: {
                id: req.params.orderid
            },
            data: {
                delivery: {
                    connect: { id: req.usrId }
                },
                status: "CONFIRMED"
            }
        })
    });

    res.json({
        success: true
    });
}
