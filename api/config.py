import os

def get_config(dataset_path):
    return dict(
        # Model configuration
        model=dict(
            type='FasterRCNN',
            backbone=dict(
                type='ResNet',
                depth=50,
                num_stages=4,
                out_indices=(0, 1, 2, 3),
                frozen_stages=1,
                norm_cfg=dict(type='BN', requires_grad=True),
                norm_eval=True,
                style='pytorch',
                init_cfg=dict(type='Pretrained', checkpoint='torchvision://resnet50')
            ),
            neck=dict(
                type='FPN',
                in_channels=[256, 512, 1024, 2048],
                out_channels=256,
                num_outs=5
            ),
            rpn_head=dict(
                type='RPNHead',
                in_channels=256,
                feat_channels=256,
                anchor_generator=dict(
                    type='AnchorGenerator',
                    scales=[8],
                    ratios=[0.5, 1.0, 2.0],
                    strides=[4, 8, 16, 32, 64]
                ),
                bbox_coder=dict(
                    type='DeltaXYWHBBoxCoder',
                    target_means=[.0, .0, .0, .0],
                    target_stds=[1.0, 1.0, 1.0, 1.0]
                ),
                loss_cls=dict(type='CrossEntropyLoss', use_sigmoid=True, loss_weight=1.0),
                loss_bbox=dict(type='L1Loss', loss_weight=1.0)
            ),
            roi_head=dict(
                type='StandardRoIHead',
                bbox_roi_extractor=dict(
                    type='SingleRoIExtractor',
                    roi_layer=dict(type='RoIAlign', output_size=7, sampling_ratio=0),
                    out_channels=256,
                    featmap_strides=[4, 8, 16, 32]
                ),
                bbox_head=dict(
                    type='Shared2FCBBoxHead',
                    in_channels=256,
                    fc_out_channels=1024,
                    roi_feat_size=7,
                    num_classes=1,  # Adjust based on your number of classes
                    bbox_coder=dict(
                        type='DeltaXYWHBBoxCoder',
                        target_means=[0., 0., 0., 0.],
                        target_stds=[0.1, 0.1, 0.2, 0.2]
                    ),
                    reg_class_agnostic=False,
                    loss_cls=dict(type='CrossEntropyLoss', use_sigmoid=False, loss_weight=1.0),
                    loss_bbox=dict(type='L1Loss', loss_weight=1.0)
                )
            ),
            train_cfg=dict(
                rpn=dict(
                    assigner=dict(
                        type='MaxIoUAssigner',
                        pos_iou_thr=0.7,
                        neg_iou_thr=0.3,
                        min_pos_iou=0.3,
                        match_low_quality=True,
                        ignore_iof_thr=-1
                    ),
                    sampler=dict(
                        type='RandomSampler',
                        num=256,
                        pos_fraction=0.5,
                        neg_pos_ub=-1,
                        add_gt_as_proposals=False
                    ),
                    allowed_border=-1,
                    pos_weight=-1,
                    debug=False
                ),
                rpn_proposal=dict(
                    nms_pre=2000,
                    max_per_img=1000,
                    nms=dict(type='nms', iou_threshold=0.7),
                    min_bbox_size=0
                ),
                rcnn=dict(
                    assigner=dict(
                        type='MaxIoUAssigner',
                        pos_iou_thr=0.5,
                        neg_iou_thr=0.5,
                        min_pos_iou=0.5,
                        match_low_quality=False,
                        ignore_iof_thr=-1
                    ),
                    sampler=dict(
                        type='RandomSampler',
                        num=512,
                        pos_fraction=0.25,
                        neg_pos_ub=-1,
                        add_gt_as_proposals=True
                    ),
                    pos_weight=-1,
                    debug=False
                )
            ),
            test_cfg=dict(
                rpn=dict(
                    nms_pre=1000,
                    max_per_img=1000,
                    nms=dict(type='nms', iou_threshold=0.7),
                    min_bbox_size=0
                ),
                rcnn=dict(
                    score_thr=0.05,
                    nms=dict(type='nms', iou_threshold=0.5),
                    max_per_img=100
                )
            )
        ),
        # Dataset configuration
        data=dict(
            train=dict(
                type='CocoDataset',
                ann_file=os.path.join(dataset_path, 'train', '_annotations.coco.json'),
                img_prefix=os.path.join(dataset_path, 'train'),
                pipeline=[
                    dict(type='LoadImageFromFile'),
                    dict(type='LoadAnnotations', with_bbox=True),
                    dict(type='Resize', img_scale=(1333, 800), keep_ratio=True),
                    dict(type='RandomFlip', flip_ratio=0.5),
                    dict(
                        type='Normalize',
                        mean=[123.675, 116.28, 103.53],
                        std=[58.395, 57.12, 57.375],
                        to_rgb=True
                    ),
                    dict(type='Pad', size_divisor=32),
                    dict(type='DefaultFormatBundle'),
                    dict(
                        type='Collect',
                        keys=['img', 'gt_bboxes', 'gt_labels']
                    )
                ]
            ),
            val=dict(
                type='CocoDataset',
                ann_file=os.path.join(dataset_path, 'valid', '_annotations.coco.json'),
                img_prefix=os.path.join(dataset_path, 'valid'),
                pipeline=[
                    dict(type='LoadImageFromFile'),
                    dict(
                        type='MultiScaleFlipAug',
                        img_scale=(1333, 800),
                        flip=False,
                        transforms=[
                            dict(type='Resize', keep_ratio=True),
                            dict(type='RandomFlip'),
                            dict(
                                type='Normalize',
                                mean=[123.675, 116.28, 103.53],
                                std=[58.395, 57.12, 57.375],
                                to_rgb=True
                            ),
                            dict(type='Pad', size_divisor=32),
                            dict(type='ImageToTensor', keys=['img']),
                            dict(type='Collect', keys=['img'])
                        ]
                    )
                ]
            ),
            test=dict(
                type='CocoDataset',
                ann_file=os.path.join(dataset_path, 'test', '_annotations.coco.json'),
                img_prefix=os.path.join(dataset_path, 'test'),
                pipeline=[
                    dict(type='LoadImageFromFile'),
                    dict(
                        type='MultiScaleFlipAug',
                        img_scale=(1333, 800),
                        flip=False,
                        transforms=[
                            dict(type='Resize', keep_ratio=True),
                            dict(type='RandomFlip'),
                            dict(
                                type='Normalize',
                                mean=[123.675, 116.28, 103.53],
                                std=[58.395, 57.12, 57.375],
                                to_rgb=True
                            ),
                            dict(type='Pad', size_divisor=32),
                            dict(type='ImageToTensor', keys=['img']),
                            dict(type='Collect', keys=['img'])
                        ]
                    )
                ]
            )
        ),
        # Training configuration
        optimizer=dict(type='SGD', lr=0.02, momentum=0.9, weight_decay=0.0001),
        optimizer_config=dict(grad_clip=None),
        lr_config=dict(
            policy='step',
            warmup='linear',
            warmup_iters=500,
            warmup_ratio=0.001,
            step=[8, 11]
        ),
        runner=dict(type='EpochBasedRunner', max_epochs=12),
        checkpoint_config=dict(interval=1),
        evaluation=dict(interval=1, metric='bbox'),
        log_config=dict(interval=50, hooks=[dict(type='TextLoggerHook')])
    ) 