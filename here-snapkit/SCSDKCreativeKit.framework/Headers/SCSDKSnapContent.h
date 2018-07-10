//
//  SCSDKSnapContent.h
//  SCSDKCreativeKit
//
//  Copyright © 2017 Snap, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class SCSDKSnapSticker;

#define SNAP_CONNECT_SDK_SNAP_MAX_STICKERS 1

@protocol SCSDKSnapContent <NSObject>

/**
 * @property caption
 * @brief Caption text to be placed on a Snap content
 */
@property (nonatomic, copy) NSString * _Nullable caption;

/**
 * @property attachmentUrl
 * @brief Web attachment URL for a Snap swipe up view
 */
@property (nonatomic, copy) NSString * _Nullable attachmentUrl;

/**
 * @property stickers
 * @brief Array of SCSDKSnapSticker
 */
@property (nonatomic, strong) SCSDKSnapSticker * _Nullable sticker;

@end
